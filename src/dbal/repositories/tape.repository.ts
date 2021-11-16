import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { ITapeDetail } from "../models/tape-detail.interface";
import { ITape } from "../models/tape.interface";

@Injectable()
export class TapeRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getTapeByImdbNumber(imdbNumber: number): Promise<ITape | null> {
    const result = await this.connection
      .request()
      .input("imdbNumber", sql.BigInt, imdbNumber)
      .query`select t.objectId, t.tapeId, t.originalTitle from ImdbNumber i INNER JOIN [Tape] t ON t.objectId = i.objectId where i.imdbNumber = @imdbNumber`;
    if (result.recordset.length === 0) {
      return null;
    }
    const { tapeId, ...storedTape } = result.recordset[0];
    storedTape.tapeId = parseInt(tapeId);

    return storedTape;
  }

  async insertObject(rowTypeId: number): Promise<string> {
    const result = await this.connection
      .request()
      .input("rowTypeId", sql.Int, rowTypeId)
      .query`insert into [Object] (rowTypeId) OUTPUT inserted.objectId values (@rowTypeId)`;
    return result.recordset[0].objectId;
  }

  async insertImdbNumber(
    objectId: string,
    imdbNumber: number
  ): Promise<sql.IResult<any>> {
    return this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, objectId)
      .input("imdbNumber", sql.BigInt, imdbNumber)
      .query`insert into ImdbNumber (objectId, imdbNumber) values (@objectId, @imdbNumber)`;
  }

  async insertTape(tape: ITape): Promise<ITape> {
    const result = await this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, tape.objectId)
      .input("originalTitle", sql.NVarChar(150), tape.originalTitle)
      .query`insert into [Tape] (objectId, originalTitle) OUTPUT inserted.tapeId values (@objectId, @originalTitle)`;

    tape.tapeId = parseInt(result.recordset[0].tapeId);

    return tape;
  }

  async updateTape(tape: ITape): Promise<ITape> {
    await this.connection
      .request()
      .input("tapeId", sql.BigInt, tape.tapeId)
      .input("originalTitle", sql.NVarChar(150), tape.originalTitle)
      .query`update Tape set 
        originalTitle = @originalTitle
        where tapeId = @tapeId`;

    return tape;
  }

  async insertTapeDetail(tapeDetail: ITapeDetail): Promise<ITapeDetail> {
    await this.connection
      .request()
      .input("budget", sql.Float, tapeDetail.budget || 0)
      .input("color", sql.NVarChar(20), tapeDetail.color)
      .input("duration", sql.SmallInt, tapeDetail.duration)
      .input("isAdult", sql.Bit, tapeDetail.isAdult || false)
      .input("hasCover", sql.Bit, tapeDetail.hasCover || false)
      .input("isTvShow", sql.Bit, tapeDetail.isTvShow || false)
      .input("isTvShowChapter", sql.Bit, tapeDetail.isTvShowChapter || false)
      .input("year", sql.SmallInt, tapeDetail.year)
      .input("tapeId", sql.BigInt, tapeDetail.tapeId)
      .query`insert into TapeDetail 
        (budget, color, duration, adult, cover, tvShow, tvShowChapter, year, tapeId) values 
        (@budget, @color, @duration, @isAdult, @hasCover, @isTvShow, @isTvShowChapter, @year, @tapeId)`;

    return tapeDetail;
  }

  async updateTapeDetail(tapeDetail: ITapeDetail): Promise<ITapeDetail> {
    await this.connection
      .request()
      .input("budget", sql.Float, tapeDetail.budget || 0)
      .input("color", sql.NVarChar(20), tapeDetail.color)
      .input("duration", sql.SmallInt, tapeDetail.duration)
      .input("isAdult", sql.Bit, tapeDetail.isAdult || false)
      .input("hasCover", sql.Bit, tapeDetail.hasCover || false)
      .input("isTvShow", sql.Bit, tapeDetail.isTvShow || false)
      .input("isTvShowChapter", sql.Bit, tapeDetail.isTvShowChapter || false)
      .input("year", sql.SmallInt, tapeDetail.year)
      .input("tapeId", sql.BigInt, tapeDetail.tapeId)
      .query`update TapeDetail set 
        budget = @budget,
        color = @color,
        duration = @duration,
        adult = @isAdult,
        cover = @hasCover,
        tvShow = @isTvShow,
        tvShowChapter = @isTvShowChapter,
        year = @year
        where tapeId = @tapeId`;

    return tapeDetail;
  }
}
