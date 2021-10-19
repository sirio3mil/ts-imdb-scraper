import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "ranking" })
export class Ranking {
  @Field()
  calculatedScore: number;

  @Field()
  score: number;

  @Field(() => Int)
  votes: number;
}
