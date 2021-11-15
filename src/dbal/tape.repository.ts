import { Injectable, Inject } from "@nestjs/common";
import * as sql from "mssql";

@Injectable()
export class TapeRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject('CONNECTION') connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getTapeByImdbNumber(imdbNumber: number): Promise<sql.IResult<any>> {
    return this.connection.request()
        .input('imdbNumber', sql.Int, imdbNumber)
        .query`select t.objectId
                ,t.tapeId 
              from ImdbNumber i 
              INNER JOIN [Tape] t ON t.objectId = i.objectId 
              where i.imdbNumber = @imdbNumber`;
  }
}
