import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape" })
export class Tape {
  @Field(() => ID)
  tapeId: string;

  @Field()
  originalTitle: string;
}
