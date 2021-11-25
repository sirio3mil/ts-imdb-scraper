import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { TapePeopleRoleCharacter } from "./tape-people-role-character.model";

@ObjectType({ description: "tape people role" })
export class TapePeopleRole {
  @Field()
  character: TapePeopleRoleCharacter;

  @Field(() => Int)
  peopleId: number;
  
  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  tapeId: number;

  @Field(() => ID)
  tapePeopleRoleId: number;
}
