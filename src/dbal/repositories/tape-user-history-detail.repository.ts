import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { TapeUserHistoryDetail } from "../models/tape-user-history-detail.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class TapeUserHistoryDetailRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
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
      tapeUserHistoryDetailId: result.recordset[0].tapeUserHistoryDetailId,
      tapeUserHistoryId,
      placeId
    };
  }
}
