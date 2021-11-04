import { NotFoundException } from "@nestjs/common";
import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Tape } from "../models/tape.model";
import { CreditService } from "../services/credit.service";
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
    private readonly parentalGuideService: ParentalGuideService
  ) {}

  @Query(() => Tape)
  async getTape(@Args("imdbNumber", { type: () => Int }) imdbNumber: number): Promise<Tape> {
    const tape = await this.tapeService.getTape(imdbNumber);
    if (!tape) {
      throw new NotFoundException(imdbNumber);
    }
    return tape;
  }

  @ResolveField()
  async credits(@Parent() tape: Tape) {
    const { url } = tape;
    return this.creditService.getCredits(url);
  }

  @ResolveField()
  async premieres(@Parent() tape: Tape) {
    const { url } = tape;
    return this.releaseInfoService.getPremieres(url);
  }

  @ResolveField()
  async titles(@Parent() tape: Tape) {
    const { url } = tape;
    return this.releaseInfoService.getTitles(url);
  }

  @ResolveField()
  async locations(@Parent() tape: Tape) {
    const { url } = tape;
    return this.locationService.getLocations(url);
  }

  @ResolveField()
  async certifications(@Parent() tape: Tape) {
    const { url } = tape;
    return this.parentalGuideService.getCertifications(url);
  }
}
