import { NotFoundException } from "@nestjs/common";
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { DbalTape } from "../models/tape.model";
import { TapeRepository } from "../repositories/tape.repository";

@Resolver(() => DbalTape)
export class DbalTapeResolver {
  constructor(private readonly tapeRepository: TapeRepository) {}

  @Query(() => DbalTape)
  async getStoredTape(
    @Args("tapeId", { type: () => ID }) tapeId: number
  ): Promise<DbalTape> {
    try {
      return this.tapeRepository.getTape(tapeId);
    } catch (e) {
      throw new NotFoundException(`Tape with tapeId ${tapeId} not found`);
    }
  }

  @ResolveField()
  async detail(@Parent() tape: DbalTape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeDetail(tapeId);
  }

  @ResolveField()
  async countries(@Parent() tape: DbalTape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeCountries(tapeId);
  }

  @ResolveField()
  async sounds(@Parent() tape: DbalTape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeSounds(tapeId);
  }

  @ResolveField()
  async languages(@Parent() tape: DbalTape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeLanguages(tapeId);
  }

  @ResolveField()
  async genres(@Parent() tape: DbalTape) {
    const { tapeId } = tape;
    return this.tapeRepository.getTapeGenres(tapeId);
  }
}
