import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { TapeUserHistoryDetail } from "../models/tape-user-history-detail.model";
import { TapeUserHistory } from "../models/tape-user-history.model";
import { TapeUser } from "../models/tape-user.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class TapeUserRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async updateTapeUser(tapeId: number, userId: number, tapeUserStatusId: number, placeId?: number): Promise<TapeUser> {
    let tapeUserHistory: TapeUserHistory;
    let tapeUser = await this.getTapeUser(tapeId, userId);
    if (!tapeUser) {
      tapeUser = await this.insertTapeUser(tapeId, userId);
      tapeUserHistory = await this.insertTapeUserHistory(tapeUser.tapeUserId, tapeUserStatusId);
    } else {
      tapeUserHistory = await this.getTapeUserHistory(tapeUser.tapeUserId, tapeUserStatusId);
      if (!tapeUserHistory) {
        tapeUserHistory = await this.insertTapeUserHistory(tapeUser.tapeUserId, tapeUserStatusId);
      }
    }
    if (tapeUserHistory && placeId) {
      await this.insertTapeUserHistoryDetail(tapeUserHistory.tapeUserHistoryId, placeId);
    }

    return tapeUser;
  }

  async getTapeUser(tapeId: number, userId: number): Promise<TapeUser | null> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .input("userId", sql.BigInt, userId)
      .query`select tapeUserId, tapeId, userId from TapeUser where tapeId = @tapeId and userId = @userId`;
    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  }

  async insertTapeUser(tapeId: number, userId: number): Promise<TapeUser> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .input("userId", sql.BigInt, userId)
      .query`insert into [TapeUser] (tapeId, userId) OUTPUT inserted.tapeUserId values (@tapeId, @userId)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(`Tape ${tapeId} can not be assigned to user ${userId}`);
    }
    
    return {
      tapeUserId: parseInt(result.recordset[0].tapeUserId),
      tapeId,
      userId
    };
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
      tapeUserHistoryId: parseInt(result.recordset[0].tapeUserHistoryId),
      tapeUserId,
      tapeUserStatusId
    };
  }

  async insertTapeUserHistoryDetail(tapeUserHistoryId: number, placeId?: number): Promise<TapeUserHistoryDetail> {
    const result = await this.connection
      .request()
      .input("tapeUserHistoryId", sql.BigInt, tapeUserHistoryId)
      .input("placeId", sql.BigInt, placeId)
      .query`insert into [TapeUserHistoryDetail] (tapeUserHistoryId, placeId) OUTPUT inserted.tapeUserHistoryDetailId values (@tapeUserHistoryId, @placeId)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(`User tape history ${tapeUserHistoryId} can not be saved for place ${placeId}`);
    }
    
    return {
      tapeUserHistoryDetailId: parseInt(result.recordset[0].tapeUserHistoryDetailId),
      tapeUserHistoryId,
      placeId
    };
  }
}
