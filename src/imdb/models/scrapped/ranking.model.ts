import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IRanking } from "src/domain/models/ranking.interface";

@ObjectType({ description: "ranking" })
export class ScrappedRanking implements IRanking {
  @Field()
  realScore: number;

  @Field()
  score: number;

  @Field(() => Int)
  votes: number;
}
