import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { TapeUserStatus } from "../../domain/enums/tape-user-status.enum";
import { TapeUserHistory } from "../models/tape-user-history.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class TapeUserHistoryRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async getTapeUserHistory(tapeUserId: number, tapeUserStatus: TapeUserStatus): Promise<TapeUserHistory | null> {
    const result = await this.connection
      .request()
      .input("tapeUserId", sql.BigInt, tapeUserId)
      .input("tapeUserStatusId", sql.BigInt, tapeUserStatus)
      .query`select tapeUserHistoryId, tapeUserId, tapeUserStatusId as tapeUserStatus from TapeUserHistory where tapeUserId = @tapeUserId and tapeUserStatusId = @tapeUserStatusId`;
    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  }

  async insertTapeUserHistory(tapeUserId: number, tapeUserStatus: TapeUserStatus): Promise<TapeUserHistory> {
    const result = await this.connection
      .request()
      .input("tapeUserId", sql.BigInt, tapeUserId)
      .input("tapeUserStatusId", sql.BigInt, tapeUserStatus)
      .query`insert into [TapeUserHistory] (tapeUserId, tapeUserStatusId) OUTPUT inserted.tapeUserHistoryId values (@tapeUserId, @tapeUserStatusId)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(`User tape ${tapeUserId} can not be saved with status ${tapeUserStatus}`);
    }
    
    return {
      tapeUserHistoryId: result.recordset[0].tapeUserHistoryId,
      tapeUserId,
      tapeUserStatus
    };
  }
}
