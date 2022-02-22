import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored locations" })
export class Location {
  @Field(() => Int)
  locationId: number;

  @Field()
  place: string;
}
