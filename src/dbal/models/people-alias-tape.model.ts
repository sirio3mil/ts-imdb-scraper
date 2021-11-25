import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "relation between people alias and tape" })
export class PeopleAliasTape {
  @Field(() => Int)
  peopleAliasId: number;

  @Field(() => ID)
  peopleAliasTapeId?: number;

  @Field(() => Int)
  tapeId: number;
}
