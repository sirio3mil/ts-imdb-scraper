import { Inject, Injectable } from "@nestjs/common";
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
}
