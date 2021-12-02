import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import slug from 'limax';
import { SearchValue } from "../models/search-value.model";
import { ScrappedTitle } from "src/imdb/models/scrapped/title.model";
import { TapeTitle } from "../models/tape-title.model";
import { CountryRepository } from "./country.repository";
import { LanguageRepository } from "./language.repository";
import { Tape } from "../models/tape.model";

@Injectable()
export class TitleRepository {
  private connection: sql.ConnectionPool;
  private countryRepository: CountryRepository;
  private languageRepository: LanguageRepository;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool, countryRepository: CountryRepository, languageRepository: LanguageRepository) {
    this.connection = connection;
    this.countryRepository = countryRepository;
    this.languageRepository = languageRepository;
  }

  async insertTapeTitle(tapeTitle: TapeTitle): Promise<TapeTitle> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeTitle.tapeId)
      .input("title", sql.NVarChar(150), tapeTitle.title)
      .input("countryId", sql.Int, tapeTitle.countryId)
      .input("languageId", sql.Int, tapeTitle.languageId)
      .input("observations", sql.NVarChar(50), tapeTitle.observations)
      .query`INSERT INTO [TapeTitle] (title, tapeId, languageId, countryId, observations) OUTPUT inserted.tapeTitleId VALUES (@title, @tapeId, @languageId, @countryId, @observations)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Title not found");
    }
    tapeTitle.tapeTitleId = parseInt(result.recordset[0].tapeTitleId);
    
    return tapeTitle;
  }

  async getTapeTitles(tapeId: number): Promise<TapeTitle[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT tapeTitleId, tapeId, title, countryId, languageId, observations FROM [TapeTitle] WHERE tapeId = @tapeId`;
    result.recordset.map((row) => {
      row.tapeTitleId = parseInt(row.tapeTitleId);
      row.tapeId = parseInt(row.tapeId);
      row.countryId = row.countryId ? parseInt(row.countryId) : null;
      row.languageId = row.languageId ? parseInt(row.languageId) : null;
    });
    return result.recordset;
  }

  async insertSearchValue(searchValue: SearchValue): Promise<SearchValue> {
    const result = await this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, searchValue.objectId)
      .input("searchParam", sql.NVarChar(250), searchValue.searchParam)
      .input("primaryParam", sql.Bit, searchValue.primaryParam)
      .input("slug", sql.NVarChar(250), searchValue.slug)
      .query`INSERT INTO SearchValue (objectId, searchParam, primaryParam, slug) OUTPUT inserted.searchValueId VALUES (@objectId, @searchParam, @primaryParam, @slug)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Search value not found");
    }
    searchValue.searchValueId = parseInt(result.recordset[0].searchValueId);
    
    return searchValue;
  }

  async getSearchValues(objectId: string): Promise<SearchValue[]> {
    const result = await this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, objectId)
      .query`SELECT searchValueId, objectId, searchParam, primaryParam, slug FROM SearchValue WHERE objectId = @objectId`;
    result.recordset.map((row) => {
      row.searchValueId = parseInt(row.searchValueId);
    });
    return result.recordset;
  }

  async processTitles(titles: ScrappedTitle[], tape: Tape): Promise<number> {
    let total = 0;
    const countryNames: string[] = [];
    const languageNames: string[] = [];
    for (const title of titles) {
      if (!!title.country && !countryNames.includes(title.country)) {
        countryNames.push(title.country);
      }
      if (!!title.language && !languageNames.includes(title.language)) {
        languageNames.push(title.language);
      }
    }
    const [countries, languages] = await Promise.all([
      this.countryRepository.processCountriesOfficialNames(countryNames),
      this.languageRepository.processLanguageNames(languageNames)
    ]);
    const stmtTitle = new sql.PreparedStatement(this.connection);
    await stmtTitle.input("tapeId", sql.BigInt)
      .input("title", sql.NVarChar(150))
      .input("countryId", sql.Int)
      .input("languageId", sql.Int)
      .input("observations", sql.NVarChar(50))
      .prepare(`INSERT INTO [TapeTitle] (title, tapeId, languageId, countryId, observations) VALUES (@title, @tapeId, @languageId, @countryId, @observations)`);
    const stmtSearch = new sql.PreparedStatement(this.connection);
    await stmtSearch.input("objectId", sql.UniqueIdentifier)
      .input("searchParam", sql.NVarChar(250))
      .input("primaryParam", sql.Bit)
      .input("slug", sql.NVarChar(250))
      .prepare(`INSERT INTO SearchValue (objectId, searchParam, primaryParam, slug) VALUES (@objectId, @searchParam, @primaryParam, @slug)`);
    
    const [tapeTitles, searchValues] = await Promise.all([
      this.getTapeTitles(tape.tapeId),
      this.getSearchValues(tape.objectId)
    ]);
    for (const title of titles) {
      const country = !!title.country && countries.find(c => c.officialName === title.country);
      const language = !!title.country && languages.find(l => l.name === title.language);
      const tapeTitle = tapeTitles.find((t) => t.title === title.title && t.countryId === (country?.countryId || null) && t.languageId === (language?.languageId || null));
      if (!tapeTitle) {
        await stmtTitle.execute({
          tapeId: tape.tapeId,
          title: title.title,
          countryId: country ? country.countryId : null,
          languageId: language ? language.languageId : null,
          observations: title.observations
        });
        total++;
      }
      let searchValue = searchValues.find((s) => s.searchParam === title.title);
      let primaryExists = searchValues.find((s) => s.primaryParam === true) ? true : false;
      if (!searchValue) {
        let primaryParam = false;
        if (!primaryExists && title.title === tape.originalTitle) {
          primaryParam = true;
          primaryExists = true;
        }
        searchValue = {
          objectId: tape.objectId,
          searchParam: title.title,
          primaryParam,
          slug: slug(title.title)
        };
        await stmtSearch.execute(searchValue);
        searchValues.push(searchValue);
      }
    }
    await stmtTitle.unprepare();
    await stmtSearch.unprepare();

    return total;
  }
}
