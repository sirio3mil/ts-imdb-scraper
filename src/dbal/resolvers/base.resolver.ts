import { Resolver, Query, Args } from "@nestjs/graphql";
import { Type } from "@nestjs/common";
import { Searchable } from "src/domain/interfaces/searchable";

export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost implements Searchable<T> {
    [x: string]: any;
    @Query(() => [classRef], { name: `findAll${classRef.name}` })
    async search(@Args("query") query: string): Promise<T[]> {
      return this.repository.search(query);
    }
  }
  return BaseResolverHost;
}

