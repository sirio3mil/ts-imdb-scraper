import { Field, ObjectType } from "@nestjs/graphql";
import { ImdbNumber } from "./imdb-number.model";
import { Ranking } from "./ranking.model";

@ObjectType({ description: "global unique object" })
export class GlobalUniqueObject {
  @Field()
  imdbNumber: ImdbNumber;

  @Field({ nullable: true })
  ranking?: Ranking;
}
