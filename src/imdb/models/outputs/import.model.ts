import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { ScrappedRanking } from "../scrapped/ranking.model";
import { CounterOutput } from "./counter.model";

@ObjectType({ description: "tape import result" })
export class ImportOutput {
  @Field(() => Int)
  tapeId: number;

  @Field()
  objectId: string;

  @Field(() => Float)
  time: number;

  @Field()
  countries: CounterOutput;

  @Field()
  sounds: CounterOutput;

  @Field()
  languages: CounterOutput;

  @Field()
  genres: CounterOutput;

  @Field()
  titles: CounterOutput;

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
