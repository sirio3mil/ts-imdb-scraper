import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Tape } from './models/tape.model';
import { ImdbService } from './imdb.service';

const pubSub = new PubSub();

@Resolver(of => Tape)
export class ImdbResolver {
  constructor(private readonly imdbService: ImdbService) {}

  @Mutation(returns => Tape)
  async importTape(@Args('imdbNumber') imdbNumber: number): Promise<Tape> {
    const tape = await this.imdbService.import(imdbNumber);
    pubSub.publish('tapeImported', { tapeImported: tape });
    return tape;
  }

  @Subscription(returns => Tape)
  recipeAdded() {
    return pubSub.asyncIterator('tapeImported');
  }
}
