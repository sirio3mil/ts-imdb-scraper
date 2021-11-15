import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { TapeInterface } from "../models/tape.interface";

@Injectable()
export class TapeRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getTapeByImdbNumber(imdbNumber: number): Promise<TapeInterface | null> {
    const result = await this.connection
      .request()
      .input("imdbNumber", sql.Int, imdbNumber)
      .query`select t.objectId, t.tapeId from ImdbNumber i INNER JOIN [Tape] t ON t.objectId = i.objectId where i.imdbNumber = @imdbNumber`;
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
      .input("objectId", sql.VarChar, objectId)
      .input("imdbNumber", sql.Int, imdbNumber)
      .query`insert into ImdbNumber (objectId, imdbNumber) values (@objectId, @imdbNumber)`;
  }

  async insertTape(objectId: string, originalTitle: string): Promise<number> {
    const result = await this.connection
      .request()
      .input("objectId", sql.VarChar, objectId)
      .input("originalTitle", sql.VarChar, originalTitle)
      .query`insert into [Tape] (objectId, originalTitle) OUTPUT inserted.tapeId values (@objectId, @originalTitle)`;

    return parseInt(result.recordset[0]?.tapeId);
  }
}
