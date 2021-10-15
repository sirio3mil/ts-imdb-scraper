import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Tape } from './models/tape.model';
import { ImdbService } from './imdb.service';

const pubSub = new PubSub();

@Resolver(of => Tape)
export class ImdbResolver {
  constructor(private readonly imdbService: ImdbService) {}

  @Query(returns => Tape)
  async getTape(@Args('imdbNumber') imdbNumber: number): Promise<Tape> {
    const tape = await this.imdbService.get(imdbNumber);
    if (!tape) {
      throw new NotFoundException(imdbNumber);
    }
    return tape;
  }

  @Mutation(returns => Tape)
  async importTape(@Args('imdbNumber') imdbNumber: number): Promise<Tape> {
    const tape = await this.imdbService.import(imdbNumber);
    pubSub.publish('tapeImported', { tapeImported: tape });
    return tape;
  }

  @Subscription(returns => Tape)
  tapeImported() {
    return pubSub.asyncIterator('tapeImported');
  }
}
