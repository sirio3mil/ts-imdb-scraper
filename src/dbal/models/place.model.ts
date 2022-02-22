import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Place {
  @Field(() => ID)
  placeId: number;

  @Field()
  description: string;
}
