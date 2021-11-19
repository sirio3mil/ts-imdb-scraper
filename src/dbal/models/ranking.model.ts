import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { IRanking } from "src/domain/models/ranking.interface";

@ObjectType({ description: "stored ranking" })
export class DbalRanking implements IRanking {
  @Field(() => Float)
  realScore: number;

  @Field(() => ID)
  objectId: string;

  @Field(() => Float)
  score: number;

  @Field(() => Int)
  votes: number;
}
