import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { DbalLanguage } from "../models/language.model";

@Injectable()
export class LanguageRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async processLanguageNames(names: string[]): Promise<DbalLanguage[]> {
    const languages: DbalLanguage[] = [];
    const notFoundLanguages: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("name", sql.NVarChar(100));
    await stmt.prepare(
      `SELECT languageId, name FROM language WHERE name = @name`
    );
    for (const name of names) {
      const result = await stmt.execute({ name });
      if (result.recordset.length > 0) {
        languages.push(<DbalLanguage>result.recordset[0]);
      } else {
        notFoundLanguages.push(name);
      }
    }
    await stmt.unprepare();
    if (notFoundLanguages.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("name", sql.NVarChar(50));
      await stmt.prepare(
        `INSERT INTO language (name) OUTPUT inserted.languageId VALUES (@name)`
      );
      for (const name of notFoundLanguages) {
        const result = await stmt.execute({ name });
        if (result.recordset.length > 0) {
          languages.push({
            languageId: parseInt(result.recordset[0].languageId),
            name,
          });
        }
      }
      await stmt.unprepare();
    }

    return languages;
  }
}
