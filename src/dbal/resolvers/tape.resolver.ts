import { NotFoundException } from "@nestjs/common";
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CertificationOutput } from "src/domain/dtos/outputs/certification.dto";
import { CreditOutput } from "src/domain/dtos/outputs/credit.dto";
import { PremiereOutput } from "src/domain/dtos/outputs/premiere.dto";
import { TitleOutput } from "src/domain/dtos/outputs/title.dto";
import { Country } from "../models/country.model";
import { Genre } from "../models/genre.model";
import { Language } from "../models/language.model";
import { Location } from "../models/location.model";
import { Ranking } from "../models/ranking.model";
import { Sound } from "../models/sound.model";
import { Tag } from "../models/tag.model";
import { TapeDetail } from "../models/tape-detail.model";
import { Tape } from "../models/tape.model";
import { TvShowChapter } from "../models/tv-show-chapter.model";
import { TvShow } from "../models/tv-show.model";
import { RankingRepository } from "../repositories/ranking.repository";
import { TapeRepository } from "../repositories/tape.repository";

@Resolver(() => Tape)
export class TapeResolver {
  constructor(
    private readonly tapeRepository: TapeRepository,
    private readonly rankingRepository: RankingRepository
  ) {}

  @Query(() => Tape, { name: "tape" })
  async getTape(
    @Args("tapeId", { type: () => ID }) tapeId: number
  ): Promise<Tape> {
    try {
      return this.tapeRepository.getTape(tapeId);
    } catch (e) {
      throw new NotFoundException(`Tape with tapeId ${tapeId} not found`);
    }
  }

  @ResolveField(() => TapeDetail, { name: "detail", nullable: true })
  async getTapeDetail(@Parent() tape: Tape): Promise<TapeDetail> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeDetail(tapeId);
  }

  @ResolveField(() => [Country], { name: "countries", nullable: true })
  async getCountries(@Parent() tape: Tape): Promise<Country[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeCountries(tapeId);
  }

  @ResolveField(() => [Sound], { name: "sounds", nullable: true })
  async getSounds(@Parent() tape: Tape): Promise<Sound[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeSounds(tapeId);
  }

  @ResolveField(() => [Language], { name: "languages", nullable: true })
  async getLanguages(@Parent() tape: Tape): Promise<Language[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeLanguages(tapeId);
  }

  @ResolveField(() => [Genre], { name: "genres", nullable: true })
  async getGenres(@Parent() tape: Tape): Promise<Genre[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeGenres(tapeId);
  }

  @ResolveField(() => Ranking, { name: "ranking", nullable: true })
  async getRanking(@Parent() tape: Tape): Promise<Ranking> {
    const { objectId } = tape;
    return this.rankingRepository.getRanking(objectId);
  }

  @ResolveField(() => TvShow, { name: "tvShow", nullable: true })
  async getTvShow(@Parent() tape: Tape): Promise<TvShow> {
    const { tapeId } = tape;
    return this.tapeRepository.getTvShow(tapeId);
  }

  @ResolveField(() => TvShowChapter, { name: "tvShowChapter", nullable: true })
  async getTvShowChapter(@Parent() tape: Tape): Promise<TvShowChapter> {
    const { tapeId } = tape;
    return this.tapeRepository.getTvShowChapter(tapeId);
  }

  @ResolveField(() => [CreditOutput], { name: "people", nullable: true })
  async getPeople(@Parent() tape: Tape): Promise<CreditOutput[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getCreditsOutput(tapeId);
  }

  @ResolveField(() => [TitleOutput], { name: "titles", nullable: true })
  async getTitles(@Parent() tape: Tape): Promise<TitleOutput[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTitlesOutput(tapeId);
  }

  @ResolveField(() => [PremiereOutput], { name: "premieres", nullable: true })
  async getPremieres(@Parent() tape: Tape): Promise<PremiereOutput[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getPremieresOutput(tapeId);
  }

  @ResolveField(() => [Location], { name: "locations", nullable: true })
  async getLocations(@Parent() tape: Tape): Promise<Location[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeLocations(tapeId);
  }

  @ResolveField(() => [CertificationOutput], { name: "certifications", nullable: true })
  async getCertifications(@Parent() tape: Tape): Promise<CertificationOutput[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getCertificationsOutput(tapeId);
  }

  @ResolveField(() => [Tag], { name: "tags", nullable: true })
  async getTags(@Parent() tape: Tape): Promise<Tag[]> {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeTags(tapeId);
  }
}
