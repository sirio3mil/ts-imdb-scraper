import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { DbalCountry } from "../models/country.model";

@Injectable()
export class CountryRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getCountryByOfficialName(officialName: string): Promise<DbalCountry> {
    const result = await this.connection
      .request()
      .input("officialName", sql.NVarChar(50), officialName)
      .query(`SELECT countryId, officialName, isoCode FROM country WHERE officialName = @officialName`);
    return result.recordset[0];
  }

  async getCountry(countryId: number): Promise<DbalCountry> {
    const result = await this.connection
      .request()
      .input("countryId", sql.Int, countryId)
      .query(`SELECT countryId, officialName, isoCode FROM country WHERE countryId = @countryId`);
    return result.recordset[0];
  }

  async insertCountry(country: DbalCountry): Promise<DbalCountry> {
    const result = await this.connection
      .request()
      .input("officialName", sql.NVarChar(50), country.officialName)
      .input("isoCode", sql.Char(2), country.isoCode)
      .query(`INSERT INTO country (officialName, isoCode) OUTPUT inserted.countryId VALUES (@officialName, @isoCode)`);
    country.countryId = parseInt(result.recordset[0].countryId);

    return country;
  }

  async updateCountry(country: DbalCountry): Promise<DbalCountry> {
    const result = await this.connection
      .request()
      .input("countryId", sql.Int, country.countryId)
      .input("officialName", sql.NVarChar(50), country.officialName)
      .input("isoCode", sql.Char(2), country.isoCode)
      .query(`UPDATE country SET officialName = @officialName, isoCode = @isoCode WHERE countryId = @countryId`);
    if (result.rowsAffected[0] === 0) {
      throw new Error("Country not found");
    }

    return country;
  }

  async processCountriesOfficialNames(officialNames: string[]): Promise<DbalCountry[]> {
    const countries: DbalCountry[] = [];
    const notFoundCountries: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("officialName", sql.NVarChar(50));
    await stmt.prepare(`SELECT countryId, officialName, isoCode FROM country WHERE officialName = @officialName`);
    for (const officialName of officialNames) { 
      const result = await stmt.execute({ officialName });
      if (result.recordset.length > 0) {
        countries.push(<DbalCountry>result.recordset[0]);
      } else {
        notFoundCountries.push(officialName);
      }
    }
    await stmt.unprepare();
    if (notFoundCountries.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("officialName", sql.NVarChar(50));
      await stmt.prepare(`INSERT INTO country (officialName) OUTPUT inserted.countryId VALUES (@officialName)`);
      for (const officialName of notFoundCountries) { 
        const result = await stmt.execute({ officialName });
        if (result.recordset.length > 0) {
          countries.push({
            countryId: parseInt(result.recordset[0].countryId),
            officialName,
          });
        }
      }
      await stmt.unprepare();
    }

    return countries;
  }
}

