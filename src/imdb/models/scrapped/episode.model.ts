import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "episode data" })
export class ScrappedEpisode {
  @Field(() => Int)
  chapter: number;

  @Field(() => Int)
  season: number;

  @Field(() => Int)
  tvShowID: number;
}
