import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored tv show" })
export class TvShow {
  @Field()
  finished: boolean;

  @Field(() => Int)
  tapeId: number;
}
