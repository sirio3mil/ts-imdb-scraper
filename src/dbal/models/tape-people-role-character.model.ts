import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape people role character" })
export class TapePeopleRoleCharacter {
  @Field()
  character: string;

  @Field(() => ID)
  tapePeopleRoleId: number;
}
