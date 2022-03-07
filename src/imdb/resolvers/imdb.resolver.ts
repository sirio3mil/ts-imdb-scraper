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
  ): Promise<ImportOutput> {
    return this.importAggregator.tape(imdbNumber);
  }

  @Mutation(() => [ImportOutput])
  async importEpisodes(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number,
    @Args("seasonNumber", { type: () => Int }) seasonNumber: number
  ): Promise<ImportOutput[]> {
    const url = this.episodeListService.createUrl(imdbNumber);
    const content = await this.episodeListService.setSeasonNumber(seasonNumber).getContent(new URL(url));
    const episodes = this.episodeListService.set$(content).getEpisodeListItems();
    const promises: ImportOutput[] = [];
    for (const episode of episodes) {
      const output = await this.importAggregator.tape(episode.imdbNumber);
      promises.push(output);
    }

    return promises;
  }
}
