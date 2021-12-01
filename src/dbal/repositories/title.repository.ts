import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
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
      .query`INSERT INTO TapeTitles (title, tapeId, languageId, countryId, observations) OUTPUT inserted.tapeTitleId VALUES (@title, @tapeId, @languageId, @countryId, @observations)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Title not found");
    }
    tapeTitle.tapeTitleId = parseInt(result.recordset[0].tapeTitleId);
    
    return tapeTitle;
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

  async processTitles(titles: ScrappedTitle[], tape: Tape): Promise<TapeTitle[]> {
    const result: TapeTitle[] = [];
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
    for (const title of titles) {
      const country = !!title.country && countries.find(c => c.officialName === title.country);
      const language = !!title.country && languages.find(l => l.name === title.language);
      const tapeTitle: TapeTitle = {
        tapeId: tape.tapeId,
        title: title.title,
        countryId: country ? country.countryId : null,
        languageId: language ? language.languageId : null,
        observations: title.observations
      };
      result.push(tapeTitle);
    }

    return result;
  }
}
