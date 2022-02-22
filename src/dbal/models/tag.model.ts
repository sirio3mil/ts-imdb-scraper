import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored country" })
export class Tag {
  @Field()
  keyword: string;

  @Field(() => Int)
  tagId: number;
}
