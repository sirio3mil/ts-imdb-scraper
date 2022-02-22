import { NotFoundException } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { TapeUser } from "../models/tape-user.model";
import { Tape } from "../models/tape.model";
import { TapeUserRepository } from "../repositories/tape-user.repository";
import { TapeRepository } from "../repositories/tape.repository";

@Resolver(() => TapeUser)
export class TapeUserResolver {
  constructor(
    private readonly tapeUserRepository: TapeUserRepository,
    private readonly tapeRepository: TapeRepository
  ) {}

  @Mutation(() => TapeUser)
  async editTapeUser(
    @Args("tapeId", { type: () => ID }) tapeId: number,
    @Args("userId", { type: () => ID }) userId: number,
    @Args("tapeUserStatusId", { type: () => ID }) tapeUserStatusId: number,
    @Args("placeId", { type: () => ID, nullable: true }) placeId: number
  ): Promise<TapeUser> {
    try {
      return this.tapeUserRepository.updateTapeUser(tapeId, userId, tapeUserStatusId, placeId);
    } catch (e) {
      throw new NotFoundException(`Tape ${tapeId} for user ${userId} not found`);
    }
  }

  @ResolveField(() => Tape, { name: "tape", nullable: true })
  async getTape(@Parent() tapeUser: TapeUser): Promise<Tape> {
    const { tapeId } = tapeUser;
    return this.tapeRepository.getTape(tapeId);
  }
}
