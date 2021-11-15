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
import { Constants } from "src/config/constants";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { Tape } from "../models/tape.model";
import { CreditService } from "../services/credit.service";
import { KeywordService } from "../services/keyword.service";
import { LocationService } from "../services/location.service";
import { ParentalGuideService } from "../services/parental-guide.service";
import { ReleaseInfoService } from "../services/release-info.service";
import { TapeService } from "../services/tape.service";

@Resolver(() => Tape)
export class TapeResolver {
  constructor(
    private readonly tapeService: TapeService,
    private readonly creditService: CreditService,
    private readonly releaseInfoService: ReleaseInfoService,
    private readonly locationService: LocationService,
    private readonly parentalGuideService: ParentalGuideService,
    private readonly keywordService: KeywordService,
    private readonly tapeRepository: TapeRepository
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
      const url = this.tapeService.createUrl(imdbNumber);
      const [tapeContent] = await Promise.all([
        this.tapeService.getContent(url),
      ]);
      this.tapeService.set$(tapeContent);
      const storedTape = await this.tapeRepository.getTapeByImdbNumber(
        imdbNumber
      );
      if (!storedTape) {
        objectId = await this.tapeRepository.insertObject(Constants.rowTypes.tape);
        await this.tapeRepository.insertImdbNumber(objectId, imdbNumber);
        tapeId = await this.tapeRepository.insertTape(
          objectId,
          this.tapeService.getOriginalTitle()
        );
      } else {
        objectId = storedTape.objectId;
        tapeId = storedTape.tapeId;
      }
      console.dir({ objectId, tapeId, imdbNumber });
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
