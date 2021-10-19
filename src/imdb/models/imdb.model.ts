import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "imdb number" })
export class Imdb {
  @Field(() => Int)
  ID: number;

  @Field({ nullable: true })
  url?: string;
}
