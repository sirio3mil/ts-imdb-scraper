import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored country" })
export class Tag {
  @Field()
  keyword: string;

  @Field(() => ID)
  tagId: number;
}
