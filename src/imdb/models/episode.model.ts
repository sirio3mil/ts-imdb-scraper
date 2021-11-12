import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "episode data" })
export class Episode {
  @Field(() => Int)
  chapter: number;

  @Field(() => Int)
  season: number;

  @Field(() => Int)
  tvShowID: number;
}
