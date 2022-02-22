import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { TapeUser } from "../models/tape-user.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class TapeUserRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
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
      tapeUserId: result.recordset[0].tapeUserId,
      tapeId,
      userId
    };
  }
}
