import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored locations" })
export class Location {
  @Field(() => ID)
  locationId: number;

  @Field()
  place: string;
}
