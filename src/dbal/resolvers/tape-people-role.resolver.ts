import { NotFoundException } from "@nestjs/common";
import { Parent, ResolveProperty, Resolver } from "@nestjs/graphql";
import { People } from "../models/people.model";
import { Role } from "../models/role.model";
import { TapePeopleRole } from "../models/tape-people-role.model";
import { PeopleRepository } from "../repositories/people.repository";
import { RoleRepository } from "../repositories/role.repository";

@Resolver(() => TapePeopleRole)
export class TapePeopleRoleResolver {
  constructor(
    private readonly peopleRepository: PeopleRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  @ResolveProperty(() => People, { name: "people" })
  async getPeople(@Parent() tapePeopleRole: TapePeopleRole): Promise<People> {
    try {
      return this.peopleRepository.getPeople(tapePeopleRole.peopleId);
    } catch (e) {
      throw new NotFoundException(
        `People with peopleId ${tapePeopleRole.peopleId} not found`
      );
    }
  }

  @ResolveProperty(() => Role, { name: "role" })
  async getRole(@Parent() tapePeopleRole: TapePeopleRole): Promise<Role> {
    try {
      return this.roleRepository.getRole(tapePeopleRole.roleId);
    } catch (e) {
      throw new NotFoundException(
        `Role with roleId ${tapePeopleRole.roleId} not found`
      );
    }
  }
}
