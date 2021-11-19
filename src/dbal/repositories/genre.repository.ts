import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { DbalGenre } from "../models/genre.model";

@Injectable()
export class GenreRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async processGenreNames(names: string[]): Promise<DbalGenre[]> {
    const genres: DbalGenre[] = [];
    const notFoundGenres: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("name", sql.NVarChar(100));
    await stmt.prepare(
      `SELECT genreId, name FROM genre WHERE name = @name`
    );
    for (const name of names) {
      const result = await stmt.execute({ name });
      if (result.recordset.length > 0) {
        genres.push(<DbalGenre>result.recordset[0]);
      } else {
        notFoundGenres.push(name);
      }
    }
    await stmt.unprepare();
    if (notFoundGenres.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("name", sql.NVarChar(50));
      await stmt.prepare(
        `INSERT INTO genre (name) OUTPUT inserted.genreId VALUES (@name)`
      );
      for (const name of notFoundGenres) {
        const result = await stmt.execute({ name });
        if (result.recordset.length > 0) {
          genres.push({
            genreId: parseInt(result.recordset[0].genreId),
            name,
          });
        }
      }
      await stmt.unprepare();
    }

    return genres;
  }
}
