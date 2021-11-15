import { NotFoundException } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Tape } from "../models/tape.model";
import { CreditService } from "../services/credit.service";
import { KeywordService } from "../services/keyword.service";
import { LocationService } from "../services/location.service";
import { ParentalGuideService } from "../services/parental-guide.service";
import { ReleaseInfoService } from "../services/release-info.service";
import { TapeService } from "../services/tape.service";
import * as sql from "mssql";
import { ConfigService } from "@nestjs/config";
import { TapeRepository } from "src/dbal/tape.repository";

@Resolver(() => Tape)
export class TapeResolver {
  constructor(
    private configService: ConfigService,
    private readonly tapeService: TapeService,
    private readonly creditService: CreditService,
    private readonly releaseInfoService: ReleaseInfoService,
    private readonly locationService: LocationService,
    private readonly parentalGuideService: ParentalGuideService,
    private readonly keywordService: KeywordService,
    private readonly tapeRepository: TapeRepository,
  ) {}

  @Query(() => Tape)
  async getTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ): Promise<Tape> {
    try {
      const url = this.tapeService.createUrl(imdbNumber);
      const content = await this.tapeService.getContent(url);
      this.tapeService.set$(content);
      return {
        ID: imdbNumber,
        url,
        originalTitle: this.tapeService.getOriginalTitle(),
        duration: this.tapeService.getDuration(),
        year: this.tapeService.getYear(),
        budget: this.tapeService.getBudget(),
        colors: this.tapeService.getColors(),
        countries: this.tapeService.getCountries(),
        languages: this.tapeService.getLanguages(),
        genres: this.tapeService.getGenres(),
        ranking: this.tapeService.getRanking(),
        sounds: this.tapeService.getSounds(),
        isTvShow: this.tapeService.isTvShow(),
        isTvShowChapter: this.tapeService.isTvShowChapter(),
        episode: this.tapeService.getEpisode(),
      };
    } catch (e) {
      throw new NotFoundException(
        `Tape with imdbNumber ${imdbNumber} not found`
      );
    }
  }

  @Mutation(() => Tape)
  async importTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ) {
    try {
      let objectId: string;
      let tapeId: number;
      const ROW_TYPE_TAPE = 4;
      //const ROW_TAPE_PERSON = 3;
      const sqlConfig = this.configService.get<sql.config>('mssql');
      const url = this.tapeService.createUrl(imdbNumber);
      const [pool, tapeContent] = await Promise.all([
        sql.connect(sqlConfig),
        this.tapeService.getContent(url),
      ]);
      this.tapeService.set$(tapeContent);
      const result = await this.tapeRepository.getTape(imdbNumber);
      if (!result.recordset.length) {
        const objectResultset = await sql.query`insert into [Object] (rowTypeId) OUTPUT inserted.objectId values (${ROW_TYPE_TAPE})`;
        objectId = objectResultset.recordset[0].objectId;
        await pool.request()
          .input('imdbNumber', sql.Int, imdbNumber)
          .input('objectId', sql.VarChar, objectId)
          .query`insert into ImdbNumber (objectId, imdbNumber) values (@objectId, @imdbNumber)`;
        const tapeResultset = await pool.request()
          .input('originalTitle', sql.VarChar, this.tapeService.getOriginalTitle())
          .input('objectId', sql.VarChar, objectId)
          .query`insert into Tape (originalTitle, objectId) OUTPUT inserted.tapeId values (@originalTitle, @objectId)`;
        tapeId = parseInt(tapeResultset.recordset[0].tapeId);
      } else {
        objectId = result.recordset[0].objectId;
        tapeId = parseInt(result.recordset[0].tapeId);
      }
      console.dir({objectId, tapeId, imdbNumber});
     } catch (err) {
      console.log(err);
     }
    return new Tape();
  }

  @ResolveField()
  async credits(@Parent() tape: Tape) {
    const { url } = tape;
    const content = await this.creditService.getContent(url);
    return this.creditService.set$(content).getCredits();
  }

  @ResolveField()
  async premieres(@Parent() tape: Tape) {
    const { url } = tape;
    const content = await this.releaseInfoService.getContent(url);
    return this.releaseInfoService.set$(content).getPremieres();
  }

  @ResolveField()
  async titles(@Parent() tape: Tape) {
    const { url } = tape;
    const content = await this.releaseInfoService.getContent(url);
    return this.releaseInfoService.set$(content).getTitles();
  }

  @ResolveField()
  async locations(@Parent() tape: Tape) {
    const { url } = tape;
    const content = await this.locationService.getContent(url);
    return this.locationService.set$(content).getLocations();
  }

  @ResolveField()
  async certifications(@Parent() tape: Tape) {
    const { url } = tape;
    const content = await this.parentalGuideService.getContent(url);
    return this.parentalGuideService.set$(content).getCertifications();
  }

  @ResolveField()
  async keywords(@Parent() tape: Tape) {
    const { url } = tape;
    const content = await this.keywordService.getContent(url);
    return this.keywordService.set$(content).getKeywords();
  }
}
