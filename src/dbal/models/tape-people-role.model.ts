import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape people role" })
export class TapePeopleRole {
  @Field(() => Int)
  peopleId: number;
  
  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  tapeId: number;

  @Field(() => ID)
  tapePeopleRoleId?: number;
}
