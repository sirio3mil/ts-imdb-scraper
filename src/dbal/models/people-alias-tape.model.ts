import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { PeopleAlias } from "./people-alias.model";

@ObjectType({ description: "relation between people alias and tape" })
export class PeopleAliasTape {
  @Field()
  peopleAlias: PeopleAlias;

  @Field(() => ID)
  peopleAliasTapeId: number;

  @Field(() => Int)
  tapeId: number;
}
