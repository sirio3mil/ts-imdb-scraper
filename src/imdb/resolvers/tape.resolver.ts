import { NotFoundException } from "@nestjs/common";
import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ScrappedTape } from "../models/scrapped/tape.model";
import { CreditService } from "../services/credit.service";
import { KeywordService } from "../services/keyword.service";
import { LocationService } from "../services/location.service";
import { ParentalGuideService } from "../services/parental-guide.service";
import { ReleaseInfoService } from "../services/release-info.service";
import { TapeService } from "../services/tape.service";

@Resolver(() => ScrappedTape)
export class TapeResolver {
  constructor(
    private readonly tapeService: TapeService,
    private readonly creditService: CreditService,
    private readonly releaseInfoService: ReleaseInfoService,
    private readonly locationService: LocationService,
    private readonly parentalGuideService: ParentalGuideService,
    private readonly keywordService: KeywordService
  ) {}

  @Query(() => ScrappedTape)
  async getTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ): Promise<ScrappedTape> {
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

  @ResolveField()
  async credits(@Parent() tape: ScrappedTape) {
    const { url } = tape;
    const content = await this.creditService.getContent(url);
    return this.creditService.set$(content).getCredits();
  }

  @ResolveField()
  async premieres(@Parent() tape: ScrappedTape) {
    const { url } = tape;
    const content = await this.releaseInfoService.getContent(url);
    return this.releaseInfoService.set$(content).getPremieres();
  }

  @ResolveField()
  async titles(@Parent() tape: ScrappedTape) {
    const { url } = tape;
    const content = await this.releaseInfoService.getContent(url);
    return this.releaseInfoService.set$(content).getTitles();
  }

  @ResolveField()
  async locations(@Parent() tape: ScrappedTape) {
    const { url } = tape;
    const content = await this.locationService.getContent(url);
    return this.locationService.set$(content).getLocations();
  }

  @ResolveField()
  async certifications(@Parent() tape: ScrappedTape) {
    const { url } = tape;
    const content = await this.parentalGuideService.getContent(url);
    return this.parentalGuideService.set$(content).getCertifications();
  }

  @ResolveField()
  async keywords(@Parent() tape: ScrappedTape) {
    const { url } = tape;
    const content = await this.keywordService.getContent(url);
    return this.keywordService.set$(content).getKeywords();
  }
}
