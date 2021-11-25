import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Credit } from "src/imdb/models/credit.model";
import { TapePeopleRole } from "../models/tape-people-role.model";

@Injectable()
export class PeopleRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async proccessCredits(persons: Credit[]): Promise<TapePeopleRole[]> {
    const result = await this.connection
      .request()
      .input("persons", sql.NVarChar(sql.MAX), JSON.stringify(persons))
      .query(
        `
        INSERT INTO people (objectId, peopleId, fullName, detail)
        OUTPUT inserted.objectId, inserted.peopleId, inserted.fullName, inserted.detail
        VALUES (@persons)
        `
      );
    return result.recordset;
  }
}
