import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as sql from "mssql";
import { CertificationOutput } from "src/domain/dtos/outputs/certification.dto";
import { CreditOutput } from "src/domain/dtos/outputs/credit.dto";
import { PremiereOutput } from "src/domain/dtos/outputs/premiere.dto";
import { TitleOutput } from "src/domain/dtos/outputs/title.dto";
import { Country } from "../models/country.model";
import { Genre } from "../models/genre.model";
import { Language } from "../models/language.model";
import { Sound } from "../models/sound.model";
import { Tag } from "../models/tag.model";
import { TapeDetail } from "../models/tape-detail.model";
import { Location } from "../models/location.model";
import { Tape } from "../models/tape.model";
import { TvShowChapter } from "../models/tv-show-chapter.model";
import { TvShow } from "../models/tv-show.model";
import { ObjectRepository } from "./object.repository";
import { Searchable } from "src/domain/interfaces/searchable";
import { FilterTapeInput } from "src/domain/dtos/inputs/filter-tape.input";

@Injectable()
export class TapeRepository extends ObjectRepository implements Searchable<Tape> {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async getTape(tapeId: number): Promise<Tape> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select t.objectId, t.tapeId, t.originalTitle from Tape t where t.tapeId = @tapeId`;

    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Tape not found");
    }

    return result.recordset[0];
  }

  async getTapeDetail(tapeId: number): Promise<TapeDetail> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select td.budget, td.color, td.duration, td.adult, td.cover, td.tvShow, td.tvShowChapter, td.year, td.tapeId from TapeDetail td where td.tapeId = @tapeId`;

    if (result.rowsAffected[0] === 0) {
      throw new NotFoundException("Tape detail not found");
    }

    return result.recordset[0];
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

  async getTapeCountries(tapeId: number): Promise<Country[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select c.countryId, c.officialName, c.isoCode from Country c INNER JOIN TapeCountry tc ON tc.countryId = c.countryId where tc.tapeId = @tapeId`;

    return result.recordset;
  }

  async getTapeSounds(tapeId: number): Promise<Sound[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select s.soundId, s.description from Sound s INNER JOIN TapeSound ts ON ts.soundId = s.soundId where ts.tapeId = @tapeId`;

    return result.recordset;
  }

  async getTapeLanguages(tapeId: number): Promise<Language[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select l.languageId, l.name from Language l INNER JOIN TapeLanguage tl ON tl.languageId = l.languageId where tl.tapeId = @tapeId`;

    return result.recordset;
  }

  async getTapeGenres(tapeId: number): Promise<Genre[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select g.genreId, g.name from Genre g INNER JOIN TapeGenre tg ON tg.genreId = g.genreId where tg.tapeId = @tapeId`;

    return result.recordset;
  }

  async getTapeLocations(tapeId: number): Promise<Location[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT l.locationId, l.place FROM [Location] l INNER JOIN [TapeLocation] tl ON tl.locationId = l.locationId WHERE tl.tapeId = @tapeId`;
    
    return result.recordset;
  }

  async getTapeTags(tapeId: number): Promise<Tag[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT t.tagId, t.keyword FROM [Tag] t INNER JOIN [TapeTag] tt ON tt.tagId = t.tagId WHERE tt.tapeId = @tapeId`;

    return result.recordset;
  }

  async getTvShow(tapeId: number): Promise<TvShow> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select tv.tapeId, tv.finished from TvShow tv where tv.tapeId = @tapeId`;

    return result.recordset[0];
  }

  async getTvShowChapter(tapeId: number): Promise<TvShowChapter> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`select tv.tapeId, tv.chapter, tv.season, tv.tvShowTapeId from TvShowChapter tv where tv.tapeId = @tapeId`;

    return result.recordset[0];
  }

  async getTvShowChaptersBySeasonNumber(tvShowTapeId:number, seasonNumber: number): Promise<TvShowChapter[]> {
    const result = await this.connection
      .request()
      .input("tvShowTapeId", sql.BigInt, tvShowTapeId)
      .input("seasonNumber", sql.BigInt, seasonNumber)
      .query`select tv.tapeId, tv.chapter, tv.season, tv.tvShowTapeId from TvShowChapter tv where tv.tvShowTapeId = @tvShowTapeId and tv.season = @seasonNumber`;

    return result.recordset;
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
          ,tprc.character
        FROM [TapePeopleRole] tpr 
        INNER JOIN [People] p ON p.peopleId = tpr.peopleId
        INNER JOIN [Role] r ON r.roleId = tpr.roleId
        LEFT JOIN [TapePeopleRoleCharacter] tprc ON tprc.tapePeopleRoleId = tpr.tapePeopleRoleId
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

  async getPremieresOutput(tapeId: number): Promise<PremiereOutput[]> { 
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query(
        `SELECT p.premiereId
          ,p.date
          ,p.place
          ,d.observation
          ,c.countryId
          ,c.officialName
        FROM [Premiere] p 
        LEFT JOIN [Country] c ON c.countryId = p.countryId
        LEFT JOIN [PremiereDetail] d ON d.premiereId = p.premiereId
        WHERE p.tapeId = @tapeId`
      );
    result.recordset.map((row) => {
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

  async getCertificationsOutput(tapeId: number): Promise<CertificationOutput[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT t.tapeCertificationId
          ,c.countryId
          ,c.officialName
          ,t.certification 
        FROM [TapeCertification] t
        LEFT JOIN [Country] c ON c.countryId = t.countryId
        WHERE t.tapeId = @tapeId`;
    result.recordset.map((row) => {
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

  async search(search: string): Promise<Tape[]> {
    const result = await this.connection
      .request()
      .input("search", sql.NVarChar(250), search)
      .query(
        `SELECT t.tapeId
          ,t.originalTitle
          ,t.objectId
        FROM [Tape] t 
        INNER JOIN [SearchValue] s ON s.objectId = t.objectId
        WHERE s.searchParam = @search`
      );

    return result.recordset;
  }

  async filter(filters: FilterTapeInput): Promise<Tape[]> {
    const joins = [];
    const where = [];
    const orderBy = [];
    const offset = ((filters.page - 1) * filters.pageSize);
    const request = this.connection.request();
    if (filters.userId) {
      joins.push(`INNER JOIN [TapeUser] u ON u.tapeId = t.tapeId`);
      where.push(`u.userId = @userId`);
      request.input("userId", sql.BigInt, filters.userId);
    }
    if (filters.tapeUserStatus) {
      joins.push(`INNER JOIN [TapeUser] u ON u.tapeId = t.tapeId`);
      joins.push(`INNER JOIN [TapeUserHistory] h ON h.tapeUserId = u.tapeUserId`);
      where.push(`h.tapeUserStatusId = @tapeUserStatusId`);
      request.input("tapeUserStatusId", sql.TinyInt, filters.tapeUserStatus);
    }
    if (typeof filters.visible === 'boolean' || filters.place) {
      joins.push(`INNER JOIN [TapeUser] u ON u.tapeId = t.tapeId`);
      joins.push(`INNER JOIN [TapeUserHistory] h ON h.tapeUserId = u.tapeUserId`);
      joins.push(`INNER JOIN [TapeUserHistoryDetail] d ON d.tapeUserHistoryId = h.tapeUserHistoryId`);
      if (typeof filters.visible === 'boolean') {
        where.push(`d.visible = @visible`);
        request.input("visible", sql.Bit, filters.visible);
      }
      if (filters.place) {
        where.push(`d.placeId = @placeId`);
        request.input("placeId", sql.TinyInt, filters.place);
      }
      orderBy.push(`d.createdAt DESC`);
    }
    if (filters.isTvShow === false) {
      joins.push(`INNER JOIN [TapeDetail] td ON td.tapeId = t.tapeId`);
      where.push(`td.tvShow = @tvShow`);
      request.input("tvShow", sql.Bit, filters.isTvShow);
    } else if (filters.isTvShow === true) {
      joins.push(`INNER JOIN [TapeUser] u ON u.tapeId = t.tapeId`);
      joins.push(`INNER JOIN [usr].[OrderedSubscribedTvShows] o ON o.tapeUserId = u.tapeUserId`);
      orderBy.push(`o.updatedAt DESC`);
    }
    if (typeof filters.isTvShowChapter === 'boolean') {
      joins.push(`INNER JOIN [TapeDetail] td ON td.tapeId = t.tapeId`);
      where.push(`td.tvShowChapter = @tvShowChapter`);
      request.input("tvShowChapter", sql.Bit, filters.isTvShowChapter);
    }
    if (typeof filters.finished === 'boolean') {
      joins.push(`INNER JOIN [TvShow] tv ON tv.tapeId = t.tapeId`);
      where.push(`tv.finished = @finished`);
      request.input("finished", sql.Bit, filters.finished);
    }
    if (filters.tvShowTapeId || filters.seasonNumber) {
      joins.push(`INNER JOIN [TvShowChapter] e ON e.tapeId = t.tapeId`);
      if (filters.tvShowTapeId) {
        where.push(`e.tvShowTapeId = @tvShowTapeId`);
        request.input("tvShowTapeId", sql.BigInt, filters.tvShowTapeId);
      }
      if (filters.seasonNumber) {
        where.push(`e.season = @season`);
        request.input("season", sql.SmallInt, filters.seasonNumber);
      }
      orderBy.push(`e.chapter`);
    }
    const queryJoins = [...new Set(joins)].join(' ');
    const queryWhere = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const queryOrderBy = orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : '';

    const result = await request
      .query(
        `SELECT t.tapeId
          ,t.originalTitle
          ,t.objectId 
        FROM [Tape] t 
        ${queryJoins} 
        ${queryWhere} 
        ${queryOrderBy} 
        OFFSET ${offset} ROWS FETCH NEXT ${filters.pageSize} ROWS ONLY`
      );

    return result.recordset;
  }
}
