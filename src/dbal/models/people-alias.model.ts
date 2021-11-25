import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "people alias" })
export class PeopleAlias {
  @Field()
  alias: string;

  @Field(() => Int)
  peopleId: number;

  @Field(() => ID)
  peopleAliasId?: number;
}
