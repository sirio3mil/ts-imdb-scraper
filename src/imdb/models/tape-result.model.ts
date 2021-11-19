import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Counter } from "./counter.model";

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
}
