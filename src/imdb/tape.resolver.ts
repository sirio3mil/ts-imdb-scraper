import { NotFoundException } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ImdbService } from "./imdb.service";
import { Tape } from "./models/tape.model";

@Resolver(() => Tape)
export class TapeResolver {
  constructor(private readonly imdbService: ImdbService) {}

  @Query(() => Tape)
  async getTape(@Args("imdbNumber") imdbNumber: number): Promise<Tape> {
    const tape = await this.imdbService.getTape(imdbNumber);
    if (!tape) {
      throw new NotFoundException(imdbNumber);
    }
    return tape;
  }

  @ResolveField()
  async credits(@Parent() tape: Tape) {
    const { url } = tape.imdb;
    return this.imdbService.getCredits(url);
  }

  @ResolveField()
  async premieres(@Parent() tape: Tape) {
    const { url } = tape.imdb;
    return this.imdbService.getPremieres(url);
  }
}
