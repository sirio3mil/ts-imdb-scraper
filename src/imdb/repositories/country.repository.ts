import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Country } from "src/dbal/models/country.model";

@Injectable()
export class CountryRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async processCountriesOfficialNames(
    officialNames: string[]
  ): Promise<Country[]> {
    const countries: Country[] = [];
    const notFoundCountries: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("officialName", sql.NVarChar(50));
    await stmt.prepare(
      `SELECT countryId, officialName, isoCode FROM country WHERE officialName = @officialName`
    );
    for (const officialName of officialNames) {
      const result = await stmt.execute({ officialName });
      if (result.recordset.length > 0) {
        countries.push(<Country>result.recordset[0]);
      } else {
        notFoundCountries.push(officialName);
      }
    }
    await stmt.unprepare();
    if (notFoundCountries.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("officialName", sql.NVarChar(50));
      await stmt.prepare(
        `INSERT INTO country (officialName) OUTPUT inserted.countryId VALUES (@officialName)`
      );
      for (const officialName of notFoundCountries) {
        const result = await stmt.execute({ officialName });
        if (result.recordset.length > 0) {
          countries.push({
            countryId: result.recordset[0].countryId,
            officialName,
          });
        }
      }
      await stmt.unprepare();
    }

    return countries;
  }
}
