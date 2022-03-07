import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "search value" })
export class SearchValue {
  @Field()
  objectId: string;

  @Field()
  primaryParam: boolean;

  @Field()
  searchParam: string;

  @Field(() => Int)
  searchValueId?: number;

  @Field()
  slug: string;
}
