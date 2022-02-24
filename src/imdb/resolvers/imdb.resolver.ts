import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { ImportOutput } from "../models/outputs/import.model";
import { ImportAggregator } from "../aggregators/import.aggregator";

@Resolver(() => ImportOutput)
export class ImdbResolver {
  constructor(
    private readonly importAggregator: ImportAggregator,
  ) {}

  @Mutation(() => ImportOutput)
  async importTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ) {
    return this.importAggregator.tape(imdbNumber);
  }
}
