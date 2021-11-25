import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";

@Injectable()
export abstract class ObjectRepository {
  protected connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
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
  ): Promise<boolean> {
    const result = await this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, objectId)
      .input("imdbNumber", sql.BigInt, imdbNumber)
      .query`insert into ImdbNumber (objectId, imdbNumber) values (@objectId, @imdbNumber)`;

    return result.rowsAffected[0] > 0;
  }
}

