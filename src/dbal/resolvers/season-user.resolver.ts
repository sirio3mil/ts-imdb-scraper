import { NotFoundException } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Resolver,
} from "@nestjs/graphql";
import { TapeUser } from "../models/tape-user.model";
import { TapeUserHistoryRepository } from "../repositories/tape-user-history.repository";
import { TapeUserRepository } from "../repositories/tape-user.repository";
import { TapeRepository } from "../repositories/tape.repository";

@Resolver(() => [TapeUser])
export class SeasonUserResolver {
  constructor(
    private readonly tapeUserRepository: TapeUserRepository,
    private readonly tapeRepository: TapeRepository,
    private readonly tapeUserHistoryRepository: TapeUserHistoryRepository
  ) {}

  @Mutation(() => [TapeUser])
  async editSeasonUser(
    @Args("tvShowTapeId", { type: () => Int }) tvShowTapeId: number,
    @Args("seasonNumber", { type: () => Int }) seasonNumber: number,
    @Args("userId", { type: () => Int }) userId: number
  ): Promise<TapeUser[]> {
    try {
      const tvShowChapters = await this.tapeRepository.getTvShowChaptersBySeasonNumber(tvShowTapeId, seasonNumber);
      console.log(tvShowChapters);
      const tapesUser: TapeUser[] = [];
      for (const tvShowChapter of tvShowChapters) {
        let tapeUser = await this.tapeUserRepository.getTapeUser(tvShowChapter.tapeId, userId);
        if (!tapeUser) {
          tapeUser = await this.tapeUserRepository.insertTapeUser(tvShowChapter.tapeId, userId);
        }
        tapesUser.push(tapeUser);
      }

      return tapesUser;
    } catch (e) {
      throw new NotFoundException(`TV show ${tvShowTapeId} for user ${userId} not found`);
    }
  }
}
