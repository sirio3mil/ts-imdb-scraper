import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { Ranking } from "../models/ranking.model";

@Injectable()
export class RankingRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getRanking(objectId: string): Promise<Ranking> {
    const result = await this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, objectId)
      .query(
        `SELECT objectId, realScore, score, votes FROM ranking WHERE objectId = @objectId`
      );
    return result.recordset[0];
  }

  async insertRanking(ranking: Ranking): Promise<Ranking> {
    const result = await this.connection
      .request()
      .input("score", sql.Float, ranking.score)
      .input("votes", sql.Int, ranking.votes)
      .input("objectId", sql.UniqueIdentifier, ranking.objectId)
      .query(
        `INSERT INTO ranking (objectId, score, votes) VALUES (@objectId, @score, @votes)`
      );
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Ranking not found");
    }

    return ranking;
  }

  async upsertRanking(ranking: Ranking): Promise<Ranking> {
    const result = await this.connection
      .request()
      .input("score", sql.Float, ranking.score)
      .input("votes", sql.Int, ranking.votes)
      .input("objectId", sql.UniqueIdentifier, ranking.objectId)
      .query(
        `UPDATE ranking SET votes = @votes, score = @score WHERE objectId = @objectId`
      );
    if (result.rowsAffected[0] === 0) {
      return this.insertRanking(ranking);
    }

    return ranking;
  }
}
