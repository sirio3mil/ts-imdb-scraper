import { NotFoundException } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { TapeUserStatus } from "../../domain/enums/tape-user-status.enum";
import { TapeUserHistory } from "../models/tape-user-history.model";
import { TapeUser } from "../models/tape-user.model";
import { Tape } from "../models/tape.model";
import { TapeUserHistoryRepository } from "../repositories/tape-user-history.repository";
import { TapeUserRepository } from "../repositories/tape-user.repository";
import { TapeRepository } from "../repositories/tape.repository";

@Resolver(() => TapeUser)
export class TapeUserResolver {
  constructor(
    private readonly tapeUserRepository: TapeUserRepository,
    private readonly tapeRepository: TapeRepository,
    private readonly tapeUserHistoryRepository: TapeUserHistoryRepository
  ) {}

  @Mutation(() => TapeUser)
  async editTapeUser(
    @Args("tapeId", { type: () => Int }) tapeId: number,
    @Args("userId", { type: () => Int }) userId: number
  ): Promise<TapeUser> {
    try {
      let tapeUser = await this.tapeUserRepository.getTapeUser(tapeId, userId);
      if (!tapeUser) {
        tapeUser = await this.tapeUserRepository.insertTapeUser(tapeId, userId);
      }

      return tapeUser;
    } catch (e) {
      throw new NotFoundException(`Tape ${tapeId} for user ${userId} not found`);
    }
  }

  @ResolveField(() => Tape, { name: "tape", nullable: true })
  async getTape(@Parent() tapeUser: TapeUser): Promise<Tape> {
    const { tapeId } = tapeUser;
    return this.tapeRepository.getTape(tapeId);
  }

  @ResolveField(() => TapeUserHistory, { nullable: true })
  async addStatus(@Args("tapeUserStatus", { type: () => TapeUserStatus }) tapeUserStatus: TapeUserStatus, @Parent() tapeUser: TapeUser): Promise<TapeUserHistory> {
    let tapeUserHistory = await this.tapeUserHistoryRepository.getTapeUserHistoryByStatus(tapeUser.tapeUserId, tapeUserStatus);
    if (!tapeUserHistory) {
      tapeUserHistory = await this.tapeUserHistoryRepository.insertTapeUserHistory(tapeUser.tapeUserId, tapeUserStatus);
    }

    return tapeUserHistory;
  }

  @ResolveField(() => TapeUserHistory, { nullable: true })
  async byStatus(@Args("tapeUserStatus", { type: () => TapeUserStatus }) tapeUserStatus: TapeUserStatus, @Parent() tapeUser: TapeUser): Promise<TapeUserHistory> {
    return this.tapeUserHistoryRepository.getTapeUserHistoryByStatus(tapeUser.tapeUserId, tapeUserStatus);
  }

  @ResolveField(() => [TapeUserHistory])
  async history(@Parent() tapeUser: TapeUser): Promise<TapeUserHistory[]> {
    return this.tapeUserHistoryRepository.getTapeUserHistories(tapeUser.tapeUserId);
  }
}
