import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "relation between people alias and tape" })
export class PeopleAliasTape {
  @Field(() => Int)
  peopleAliasId: number;

  @Field(() => Int)
  peopleAliasTapeId?: number;

  @Field(() => Int)
  tapeId: number;
}
