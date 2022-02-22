import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { TapeUserHistory } from "../models/tape-user-history.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class TapeUserHistoryRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async getTapeUserHistory(tapeUserId: number, tapeUserStatusId: number): Promise<TapeUserHistory | null> {
    const result = await this.connection
      .request()
      .input("tapeUserId", sql.BigInt, tapeUserId)
      .input("tapeUserStatusId", sql.BigInt, tapeUserStatusId)
      .query`select tapeUserHistoryId, tapeUserId, tapeUserStatusId from TapeUserHistory where tapeUserId = @tapeUserId and tapeUserStatusId = @tapeUserStatusId`;
    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  }

  async insertTapeUserHistory(tapeUserId: number, tapeUserStatusId: number): Promise<TapeUserHistory> {
    const result = await this.connection
      .request()
      .input("tapeUserId", sql.BigInt, tapeUserId)
      .input("tapeUserStatusId", sql.BigInt, tapeUserStatusId)
      .query`insert into [TapeUserHistory] (tapeUserId, tapeUserStatusId) OUTPUT inserted.tapeUserHistoryId values (@tapeUserId, @tapeUserStatusId)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(`User tape ${tapeUserId} can not be saved with status ${tapeUserStatusId}`);
    }
    
    return {
      tapeUserHistoryId: result.recordset[0].tapeUserHistoryId,
      tapeUserId,
      tapeUserStatusId
    };
  }
}
