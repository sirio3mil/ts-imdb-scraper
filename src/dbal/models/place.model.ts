import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Place {
  @Field(() => Int)
  placeId: number;

  @Field()
  description: string;
}
