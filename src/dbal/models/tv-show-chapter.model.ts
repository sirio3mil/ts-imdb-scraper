import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored tv show chapter" })
export class TvShowChapter {
  @Field(() => Int)
  chapter: number;

  @Field(() => Int)
  season: number;

  @Field(() => ID)
  tapeId: number;

  @Field(() => Int)
  tvShowTapeId: number;
}
