import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Premiere } from "src/dbal/models/premiere.model";
import { ScrappedPremiere } from "../models/scrapped/premiere.model";
import { CountryRepository } from "./country.repository";

@Injectable()
export class PremiereRepository {
  private connection: sql.ConnectionPool;
  private countryRepository: CountryRepository;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool, countryRepository: CountryRepository) {
    this.connection = connection;
    this.countryRepository = countryRepository;
  }

  async getTapePremieres(tapeId: number): Promise<Premiere[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT p.premiereId, p.tapeId, p.date, p.countryId, p.place, d.observation FROM [Premiere] p LEFT JOIN [PremiereDetail] d ON d.premiereId = p.premiereId WHERE p.tapeId = @tapeId AND p.place = 'Movie'`;
    result.recordset.map((row) => {
      row.premiereId = parseInt(row.premiereId);
      row.tapeId = parseInt(row.tapeId);
      row.countryId = row.countryId ? parseInt(row.countryId) : null;
    });
    return result.recordset;
  }

  async processPremieres(tapeId: number, scrappedPremieres: ScrappedPremiere[]): Promise<number> {
    let total = 0;
    const countryNames: string[] = [];
    for (const item of scrappedPremieres) {
      if (!!item.country && !countryNames.includes(item.country)) {
        countryNames.push(item.country);
      }
    }
    const [countries, premieres] = await Promise.all([
      this.countryRepository.processCountriesOfficialNames(countryNames),
      this.getTapePremieres(tapeId),
    ]);
    const stmtPremiere = new sql.PreparedStatement(this.connection);
    await stmtPremiere.input("tapeId", sql.BigInt)
      .input("date", sql.Date)
      .input("countryId", sql.Int)
      .prepare(`INSERT INTO [Premiere] (tapeId, date, countryId, place) OUTPUT inserted.premiereId VALUES (@tapeId, @date, @countryId, 'Movie')`);
    const stmtDetail = new sql.PreparedStatement(this.connection);
    await stmtDetail.input("premiereId", sql.BigInt)
      .input("observation", sql.NVarChar(200))
      .prepare(`INSERT INTO [PremiereDetail] (premiereId, observation) VALUES (@premiereId, @observation)`);
    for (const item of scrappedPremieres) {
      const country = !!item.country && countries.find(c => c.officialName === item.country);
      let premiere = premieres.find((premiere) => premiere.date.toDateString() === item.date.toDateString() && premiere.countryId === (country?.countryId || null));
      if (!premiere) {        
        premiere = {
          tapeId: tapeId,
          date: item.date,
          countryId: country?.countryId || null,
        }
        const result = await stmtPremiere.execute(premiere);
        premiere.premiereId = parseInt(result.recordset[0].premiereId);
        total++;
      }
      if (!!item.detail && premiere.observation !== item.detail) {
        await stmtDetail.execute({
          premiereId: premiere.premiereId,
          observation: item.detail,
        });
      }
    }
    await Promise.all([
      stmtPremiere.unprepare(),
      stmtDetail.unprepare()
    ]);
    return total;
  }
}
