import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import slug from 'limax';
import { CreditOutput } from "src/domain/dtos/outputs/credit.dto";
import { TitleOutput } from "src/domain/dtos/outputs/title.dto";
import { Country } from "src/dbal/models/country.model";
import { Genre } from "src/dbal/models/genre.model";
import { Language } from "src/dbal/models/language.model";
import { Sound } from "src/dbal/models/sound.model";
import { TapeDetail } from "src/dbal/models/tape-detail.model";
import { Tape } from "src/dbal/models/tape.model";
import { TvShowChapter } from "src/dbal/models/tv-show-chapter.model";
import { ObjectRepository } from "./object.repository";
import { TitleRepository } from "./title.repository";

@Injectable()
export class TapeRepository extends ObjectRepository {
  private titleRepository: TitleRepository;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool, titleRepository: TitleRepository) {
    super(connection);
    this.titleRepository = titleRepository;
  }

  async getTapeByImdbNumber(imdbNumber: number): Promise<Tape | null> {
    const result = await this.connection
      .request()
      .input("imdbNumber", sql.BigInt, imdbNumber)
      .query`select t.objectId, t.tapeId, t.originalTitle from ImdbNumber i INNER JOIN [Tape] t ON t.objectId = i.objectId where i.imdbNumber = @imdbNumber`;
    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0];
  }

  async insertTape(tape: Tape): Promise<Tape> {
    const [result, ] = await Promise.all([
      this.connection
        .request()
        .input("objectId", sql.UniqueIdentifier, tape.objectId)
        .input("originalTitle", sql.NVarChar(150), tape.originalTitle)
        .query`insert into [Tape] (objectId, originalTitle) OUTPUT inserted.tapeId values (@objectId, @originalTitle)`,
      this.titleRepository.insertSearchValue({
        objectId: tape.objectId,
        searchParam: tape.originalTitle,
        primaryParam: true,
        slug: slug(tape.originalTitle)
      })
    ]);
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Tape not found");
    }
    tape.tapeId = result.recordset[0].tapeId;

    return tape;
  }

  async upsertTape(tape: Tape): Promise<Tape> {
    const [result, ] = await Promise.all([
      this.connection
        .request()
        .input("tapeId", sql.BigInt, tape.tapeId)
        .input("originalTitle", sql.NVarChar(150), tape.originalTitle)
        .query`update Tape set originalTitle = @originalTitle where tapeId = @tapeId`,
      this.titleRepository.insertSearchValue({
        objectId: tape.objectId,
        searchParam: tape.originalTitle,
        primaryParam: true,
        slug: slug(tape.originalTitle)
      })
    ]);

    if (result.rowsAffected[0] === 0) {
      return this.insertTape(tape);
    }

    return tape;
  }

  async insertTapeDetail(tapeDetail: TapeDetail): Promise<TapeDetail> {
    const result = await this.connection
      .request()
      .input("budget", sql.Float, tapeDetail.budget || 0)
      .input("color", sql.NVarChar(20), tapeDetail.color)
      .input("duration", sql.SmallInt, tapeDetail.duration)
      .input("adult", sql.Bit, tapeDetail.adult || false)
      .input("cover", sql.Bit, tapeDetail.cover || false)
      .input("tvShow", sql.Bit, tapeDetail.tvShow || false)
      .input("tvShowChapter", sql.Bit, tapeDetail.tvShowChapter || false)
      .input("year", sql.SmallInt, tapeDetail.year)
      .input("tapeId", sql.BigInt, tapeDetail.tapeId)
      .query`insert into TapeDetail 
        (budget, color, duration, adult, cover, tvShow, tvShowChapter, year, tapeId) values 
        (@budget, @color, @duration, @adult, @cover, @tvShow, @tvShowChapter, @year, @tapeId)`;

    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Tape detail not found");
    }

    return tapeDetail;
  }

  async upsertTapeDetail(tapeDetail: TapeDetail): Promise<TapeDetail> {
    const result = await this.connection
      .request()
      .input("budget", sql.Float, tapeDetail.budget || 0)
      .input("color", sql.NVarChar(20), tapeDetail.color)
      .input("duration", sql.SmallInt, tapeDetail.duration)
      .input("adult", sql.Bit, tapeDetail.adult || false)
      .input("cover", sql.Bit, tapeDetail.cover || false)
      .input("tvShow", sql.Bit, tapeDetail.tvShow || false)
      .input("tvShowChapter", sql.Bit, tapeDetail.tvShowChapter || false)
      .input("year", sql.SmallInt, tapeDetail.year)
      .input("tapeId", sql.BigInt, tapeDetail.tapeId)
      .query`update TapeDetail set 
        budget = @budget,
        color = @color,
        duration = @duration,
        adult = @adult,
        cover = @cover,
        tvShow = @tvShow,
        tvShowChapter = @tvShowChapter,
        year = @year
        where tapeId = @tapeId`;

    if (result.rowsAffected[0] === 0) {
      return this.insertTapeDetail(tapeDetail);
    }

    return tapeDetail;
  }

  async getTapeCountries(tapeId: number): Promise<Country[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select c.countryId, c.officialName, c.isoCode from Country c INNER JOIN TapeCountry tc ON tc.countryId = c.countryId where tc.tapeId = @tapeId`;

    return result.recordset;
  }

  async addCountries(tapeId: number, countries: Country[]): Promise<number> {
    const countryIds = countries.map((c) => c.countryId);
    const tapeCountries = await this.getTapeCountries(tapeId);
    tapeCountries.forEach((country) => {
      const index = countryIds.indexOf(country.countryId);
      if (index >= 0) {
        countryIds.splice(index, 1);
      }
    });
    if (countryIds.length === 0) {
      return 0;
    }
    const stmt = new sql.PreparedStatement(this.connection);
    stmt.input("tapeId", sql.BigInt);
    stmt.input("countryId", sql.Int);
    await stmt.prepare(
      `insert into TapeCountry (tapeId, countryId) values (@tapeId, @countryId)`
    );
    for (const countryId of countryIds) {
      await stmt.execute({ tapeId, countryId });
    }
    await stmt.unprepare();
    return countryIds.length;
  }

  async getTapeSounds(tapeId: number): Promise<Sound[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select s.soundId, s.description from Sound s INNER JOIN TapeSound ts ON ts.soundId = s.soundId where ts.tapeId = @tapeId`;

    return result.recordset;
  }

  async addSounds(tapeId: number, sounds: Sound[]): Promise<number> {
    const soundIds = sounds.map((c) => c.soundId);
    const tapeSounds = await this.getTapeSounds(tapeId);
    tapeSounds.forEach((sound) => {
      const index = soundIds.indexOf(sound.soundId);
      if (index >= 0) {
        soundIds.splice(index, 1);
      }
    });
    if (soundIds.length === 0) {
      return 0;
    }
    const stmt = new sql.PreparedStatement(this.connection);
    stmt.input("tapeId", sql.BigInt);
    stmt.input("soundId", sql.Int);
    await stmt.prepare(
      `insert into TapeSound (tapeId, soundId) values (@tapeId, @soundId)`
    );
    for (const soundId of soundIds) {
      await stmt.execute({ tapeId, soundId });
    }
    await stmt.unprepare();
    return soundIds.length;
  }

  async getTapeLanguages(tapeId: number): Promise<Language[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select l.languageId, l.name from Language l INNER JOIN TapeLanguage tl ON tl.languageId = l.languageId where tl.tapeId = @tapeId`;

    return result.recordset;
  }

  async addLanguages(tapeId: number, languages: Language[]): Promise<number> {
    const languageIds = languages.map((c) => c.languageId);
    const tapeLanguages = await this.getTapeLanguages(tapeId);
    tapeLanguages.forEach((language) => {
      const index = languageIds.indexOf(language.languageId);
      if (index >= 0) {
        languageIds.splice(index, 1);
      }
    });
    if (languageIds.length === 0) {
      return 0;
    }
    const stmt = new sql.PreparedStatement(this.connection);
    stmt.input("tapeId", sql.BigInt);
    stmt.input("languageId", sql.Int);
    await stmt.prepare(
      `insert into TapeLanguage (tapeId, languageId) values (@tapeId, @languageId)`
    );
    for (const languageId of languageIds) {
      await stmt.execute({ tapeId, languageId });
    }
    await stmt.unprepare();
    return languageIds.length;
  }

  async getTapeGenres(tapeId: number): Promise<Genre[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select g.genreId, g.name from Genre g INNER JOIN TapeGenre tg ON tg.genreId = g.genreId where tg.tapeId = @tapeId`;

    return result.recordset;
  }

  async addGenres(tapeId: number, genres: Genre[]): Promise<number> {
    const genreIds = genres.map((c) => c.genreId);
    const tapeGenres = await this.getTapeGenres(tapeId);
    tapeGenres.forEach((genre) => {
      const index = genreIds.indexOf(genre.genreId);
      if (index >= 0) {
        genreIds.splice(index, 1);
      }
    });
    if (genreIds.length === 0) {
      return 0;
    }
    const stmt = new sql.PreparedStatement(this.connection);
    stmt.input("tapeId", sql.BigInt);
    stmt.input("genreId", sql.Int);
    await stmt.prepare(
      `insert into TapeGenre (tapeId, genreId) values (@tapeId, @genreId)`
    );
    for (const genreId of genreIds) {
      await stmt.execute({ tapeId, genreId });
    }
    await stmt.unprepare();
    return genreIds.length;
  }

  async insertTvShow(tape: Tape, finished: boolean): Promise<Tape> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tape.tapeId)
      .input("finished", sql.Bit, finished)
      .query`insert into TvShow (tapeId, finished) values (@tapeId, @finished)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(`TvShow with id ${tape.tapeId} not found`);
    }

    return tape;
  }

  async upsertTvShow(tape: Tape, finished: boolean): Promise<Tape> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tape.tapeId)
      .input("finished", sql.Bit, finished)
      .query`update TvShow set finished = @finished where tapeId = @tapeId`;
    if (result.rowsAffected[0] === 0) {
      return this.insertTvShow(tape, finished);
    }

    return tape;
  }

  async insertTvShowChapter(
    tvShowChapter: TvShowChapter
  ): Promise<TvShowChapter> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tvShowChapter.tapeId)
      .input("chapter", sql.Int, tvShowChapter.chapter)
      .input("season", sql.Int, tvShowChapter.season)
      .input("tvShowTapeId", sql.BigInt, tvShowChapter.tvShowTapeId)
      .query`insert into TvShowChapter (tapeId, chapter, season, tvShowTapeId) values (@tapeId, @chapter, @season, @tvShowTapeId)`;
    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException(
        `TvShowChapter with id ${tvShowChapter.tapeId} not found`
      );
    }

    return tvShowChapter;
  }

  async upsertTvShowChapter(
    tvShowChapter: TvShowChapter
  ): Promise<TvShowChapter> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tvShowChapter.tapeId)
      .input("chapter", sql.Int, tvShowChapter.chapter)
      .input("season", sql.Int, tvShowChapter.season)
      .input("tvShowTapeId", sql.BigInt, tvShowChapter.tvShowTapeId)
      .query`update TvShowChapter set chapter = @chapter, season = @season, tvShowTapeId = @tvShowTapeId where tapeId = @tapeId`;
    if (result.rowsAffected[0] === 0) {
      return this.insertTvShowChapter(tvShowChapter);
    }

    return tvShowChapter;
  }

  async getCreditsOutput(tapeId: number): Promise<CreditOutput[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query(
        `SELECT r.roleId
          ,r.role
          ,p.peopleId
          ,p.fullName
          ,tpr.tapeId
          ,tpr.tapePeopleRoleId 
        FROM [TapePeopleRole] tpr 
        INNER JOIN [People] p ON p.peopleId = tpr.peopleId
        INNER JOIN [Role] r ON r.roleId = tpr.roleId
        WHERE tpr.tapeId = @tapeId`
      );
    result.recordset.map((row) => {
      row.people = {
        peopleId: row.peopleId,
        fullName: row.fullName,
      };
      row.role = {
        roleId: row.roleId,
        role: row.role,
      };
    });
    return result.recordset;
  }

  async getTitlesOutput(tapeId: number): Promise<TitleOutput[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query(
        `SELECT c.countryId
          ,c.officialName
          ,l.languageId
          ,l.name
          ,t.tapeTitleId
          ,t.observations
          ,t.title 
        FROM [TapeTitle] t 
        LEFT JOIN [Country] c ON c.countryId = t.countryId
        LEFT JOIN [Language] l ON l.languageId = t.languageId
        WHERE t.tapeId = @tapeId`
      );
    result.recordset.map((row) => {
      row.language = null;
      if (row.languageId) {
        row.language = {
          languageId: row.languageId,
          name: row.name,
        }
      }
      row.country = null;
      if (row.countryId) {
        row.country = {
          countryId: row.countryId,
          officialName: row.officialName,
        }
      }
    });
    return result.recordset;
  }
}
