import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Counter } from "./counter.model";
import { ScrappedRanking } from "./ranking.model";

@ObjectType({ description: "tape import result" })
export class TapeResult {
  @Field(() => Int)
  tapeId: number;

  @Field()
  objectId: string;

  @Field()
  countries: Counter;

  @Field()
  sounds: Counter;

  @Field()
  languages: Counter;

  @Field()
  genres: Counter;

  @Field()
  ranking: ScrappedRanking;

  @Field({ nullable: true })
  finished?: boolean;

  @Field(() => Int, { nullable: true })
  tvShowTapeId?: number;

  @Field(() => Int, { nullable: true })
  chapter?: number;

  @Field(() => Int, { nullable: true })
  season?: number;

  @Field(() => Int, { nullable: true })
  directors?: number;

  @Field(() => Int, { nullable: true })
  writers?: number;

  @Field(() => Int, { nullable: true })
  cast?: number;
}
