import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { TapeCertification } from "src/dbal/models/tape-certification.model";
import { ScrappedCertification } from "../models/scrapped/certification.model";
import { CountryRepository } from "./country.repository";

@Injectable()
export class CertificationRepository {
  private connection: sql.ConnectionPool;
  private countryRepository: CountryRepository;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool, countryRepository: CountryRepository) {
    this.connection = connection;
    this.countryRepository = countryRepository;
  }

  async getTapeCertifications(tapeId: number): Promise<TapeCertification[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT tapeCertificationId, tapeId, countryId, certification FROM [TapeCertification] WHERE tapeId = @tapeId`;
    result.recordset.map((row) => {
      row.tapeCertificationId = parseInt(row.tapeCertificationId);
      row.tapeId = parseInt(row.tapeId);
      row.countryId = row.countryId ? parseInt(row.countryId) : null;
    });
    return result.recordset;
  }

  async processCertifications(tapeId: number, certifications: ScrappedCertification[]): Promise<number> {
    let total = 0;
    const countryNames: string[] = [];
    for (const item of certifications) {
      if (!!item.country && !countryNames.includes(item.country)) {
        countryNames.push(item.country);
      }
    }
    const [countries, tapeCertifications] = await Promise.all([
      this.countryRepository.processCountriesOfficialNames(countryNames),
      this.getTapeCertifications(tapeId),
    ]);
    const stmt = new sql.PreparedStatement(this.connection);
    await stmt.input("tapeId", sql.BigInt)
      .input("certification", sql.NVarChar(50))
      .input("countryId", sql.Int)
      .prepare(`INSERT INTO [TapeCertification] (tapeId, countryId, certification) OUTPUT inserted.tapeCertificationId VALUES (@tapeId, @countryId, @certification)`);
    for (const certification of certifications) {
      const country = !!certification.country && countries.find(c => c.officialName === certification.country);
      const tapeCertification = tapeCertifications.find((tapeCertification) => tapeCertification.countryId === country.countryId);
      if (!tapeCertification) {
        await stmt.execute({
          tapeId: tapeId,
          certification: certification.certification,
          countryId: country?.countryId || null,
        });
        total++;
      }
    }
    await stmt.unprepare();
    return total;
  }
}
