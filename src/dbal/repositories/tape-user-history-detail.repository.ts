import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { Place } from "../enums/place.enum";
import { TapeUserHistoryDetail } from "../models/tape-user-history-detail.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class TapeUserHistoryDetailRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async insertTapeUserHistoryDetail(tapeUserHistoryId: number, place: Place): Promise<TapeUserHistoryDetail> {
    const result = await this.connection
      .request()
      .input("tapeUserHistoryId", sql.BigInt, tapeUserHistoryId)
      .input("placeId", sql.BigInt, place)
      .query`insert into [TapeUserHistoryDetail] (tapeUserHistoryId, placeId) OUTPUT inserted.tapeUserHistoryDetailId values (@tapeUserHistoryId, @placeId)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(`User tape history ${tapeUserHistoryId} can not be saved for place ${place}`);
    }
    
    return {
      tapeUserHistoryDetailId: result.recordset[0].tapeUserHistoryDetailId,
      tapeUserHistoryId,
      place
    };
  }
}
