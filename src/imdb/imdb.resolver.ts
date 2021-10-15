import { NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Tape } from "./models/tape.model";
import { ImdbService } from "./imdb.service";

const pubSub = new PubSub();

@Resolver(() => Tape)
export class ImdbResolver {
  constructor(private readonly imdbService: ImdbService) {}

  @Query(() => Tape)
  async getTape(@Args("imdbNumber") imdbNumber: number): Promise<Tape> {
    const tape = await this.imdbService.getTape(imdbNumber);
    if (!tape) {
      throw new NotFoundException(imdbNumber);
    }
    return tape;
  }

  @Mutation(() => Tape)
  async importTape(@Args("imdbNumber") imdbNumber: number): Promise<Tape> {
    const tape = await this.imdbService.importTape(imdbNumber);
    pubSub.publish("tapeImported", { tapeImported: tape });
    return tape;
  }

  @Subscription(() => Tape)
  tapeImported() {
    return pubSub.asyncIterator("tapeImported");
  }
}
