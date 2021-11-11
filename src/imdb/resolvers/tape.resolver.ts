import { NotFoundException } from "@nestjs/common";
import {
  Args,
  Int,
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

@Resolver(() => Tape)
export class TapeResolver {
  constructor(
    private readonly tapeService: TapeService,
    private readonly creditService: CreditService,
    private readonly releaseInfoService: ReleaseInfoService,
    private readonly locationService: LocationService,
    private readonly parentalGuideService: ParentalGuideService,
    private readonly keywordService: KeywordService
  ) {}

  @Query(() => Tape)
  async getTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ): Promise<Tape> {
    try{
      const url = this.tapeService.createUrl(imdbNumber);
      await this.tapeService.loadContent(url);
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
        isTvShow: false,
        isTvShowChapter: false
      }
    }catch(e){
      throw new NotFoundException(`Tape with imdbNumber ${imdbNumber} not found`);
    }
  }

  @ResolveField()
  async credits(@Parent() tape: Tape) {
    const { url } = tape;
    await this.creditService.loadContent(url);
    return this.creditService.getCredits();
  }

  @ResolveField()
  async premieres(@Parent() tape: Tape) {
    const { url } = tape;
    await this.releaseInfoService.loadContent(url);
    return this.releaseInfoService.getPremieres();
  }

  @ResolveField()
  async titles(@Parent() tape: Tape) {
    const { url } = tape;
    await this.releaseInfoService.loadContent(url);
    return this.releaseInfoService.getTitles();
  }

  @ResolveField()
  async locations(@Parent() tape: Tape) {
    const { url } = tape;
    await this.locationService.loadContent(url);
    return this.locationService.getLocations();
  }

  @ResolveField()
  async certifications(@Parent() tape: Tape) {
    const { url } = tape;
    await this.parentalGuideService.loadContent(url);
    return this.parentalGuideService.getCertifications();
  }

  @ResolveField()
  async keywords(@Parent() tape: Tape) {
    const { url } = tape;
    await this.keywordService.loadContent(url);
    return this.keywordService.getKeywords();
  }
}
