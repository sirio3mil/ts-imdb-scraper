import { NotFoundException } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { TapeService } from "../services/tape.service";
import { Tape } from "../models/tape.model";
import { CreditService } from "../services/credit.service";
import { PremiereService } from "../services/premiere.service";

@Resolver(() => Tape)
export class TapeResolver {
  constructor(
    private readonly tapeService: TapeService,
    private readonly creditService: CreditService,
    private readonly premiereService: PremiereService
  ) {}

  @Query(() => Tape)
  async getTape(@Args("imdbNumber") imdbNumber: number): Promise<Tape> {
    const tape = await this.tapeService.getTape(imdbNumber);
    if (!tape) {
      throw new NotFoundException(imdbNumber);
    }
    return tape;
  }

  @ResolveField()
  async credits(@Parent() tape: Tape) {
    const { url } = tape.imdb;
    return this.creditService.getCredits(url);
  }

  @ResolveField()
  async premieres(@Parent() tape: Tape) {
    const { url } = tape.imdb;
    return this.premiereService.getPremieres(url);
  }
}
