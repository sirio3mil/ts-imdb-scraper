import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored tape" })
export class Tape {
  @Field()
  originalTitle: string;

  @Field()
  objectId: string;

  @Field(() => Int)
  tapeId?: number;
}
