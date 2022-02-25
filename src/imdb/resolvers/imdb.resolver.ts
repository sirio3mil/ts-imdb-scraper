import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { ImportOutput } from "../models/outputs/import.model";
import { ImportAggregator } from "../aggregators/import.aggregator";
import { EpisodeListService } from "../services/episode-list.service";

@Resolver(() => ImportOutput)
export class ImdbResolver {
  constructor(
    private readonly importAggregator: ImportAggregator,
    private readonly episodeListService: EpisodeListService,
  ) {}

  @Mutation(() => ImportOutput)
  async importTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ) {
    return this.importAggregator.tape(imdbNumber);
  }

  @Mutation(() => [ImportOutput])
  async importEpisodes(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number,
    @Args("seasonNumber", { type: () => Int }) seasonNumber: number
  ) {
    const url = this.episodeListService.createUrl(imdbNumber);
    const content = await this.episodeListService.setSeasonNumber(seasonNumber).getContent(new URL(url));
    const episodes = this.episodeListService.set$(content).getEpisodeListItems();
    const promises: Promise<ImportOutput>[] = [];
    for (const episode of episodes) {
      promises.push(this.importAggregator.tape(episode.imdbNumber));
    }

    return promises;
  }
}
