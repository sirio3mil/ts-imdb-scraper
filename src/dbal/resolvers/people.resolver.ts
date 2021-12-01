import { NotFoundException } from "@nestjs/common";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import { People } from "../models/people.model";
import { PeopleRepository } from "../repositories/people.repository";

@Resolver(() => People)
export class PeopleResolver {
  constructor(private readonly peopleRepository: PeopleRepository) {}

  @Query(() => People)
  async getPeople(
    @Args("peopleId", { type: () => ID }) peopleId: number
  ): Promise<People> {
    try {
      return this.peopleRepository.getPeople(peopleId);
    } catch (e) {
      throw new NotFoundException(`People with peopleId ${peopleId} not found`);
    }
  }
}
