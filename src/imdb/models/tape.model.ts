import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape" })
export class Tape {
  @Field()
  originalTitle: string;
}
