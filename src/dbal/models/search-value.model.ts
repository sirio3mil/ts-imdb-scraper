import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "people role" })
export class SearchValue {
  @Field()
  objectId: string;

  @Field()
  primaryParam: boolean;

  @Field()
  searchParam: string;

  @Field(() => ID)
  searchValueId: number;

  @Field()
  slug: string;
}
