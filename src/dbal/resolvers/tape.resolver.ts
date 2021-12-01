import { NotFoundException } from "@nestjs/common";
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Tape } from "../models/tape.model";
import { RankingRepository } from "../repositories/ranking.repository";
import { TapeRepository } from "../repositories/tape.repository";

@Resolver(() => Tape)
export class TapeResolver {
  constructor(
    private readonly tapeRepository: TapeRepository,
    private readonly rankingRepository: RankingRepository
  ) {}

  @Query(() => Tape)
  async getTape(
    @Args("tapeId", { type: () => ID }) tapeId: number
  ): Promise<Tape> {
    try {
      return this.tapeRepository.getTape(tapeId);
    } catch (e) {
      throw new NotFoundException(`Tape with tapeId ${tapeId} not found`);
    }
  }

  @ResolveField()
  async detail(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeDetail(tapeId);
  }

  @ResolveField()
  async countries(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeCountries(tapeId);
  }

  @ResolveField()
  async sounds(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeSounds(tapeId);
  }

  @ResolveField()
  async languages(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeLanguages(tapeId);
  }

  @ResolveField()
  async genres(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeGenres(tapeId);
  }

  @ResolveField()
  async ranking(@Parent() tape: Tape) {
    const { objectId } = tape;
    return this.rankingRepository.getRanking(objectId);
  }

  @ResolveField()
  async tvShow(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTvShow(tapeId);
  }

  @ResolveField()
  async tvShowChapter(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTvShowChapter(tapeId);
  }

  @ResolveField()
  async people(@Parent() tape: Tape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapePeopleRoles(tapeId);
  }
}
