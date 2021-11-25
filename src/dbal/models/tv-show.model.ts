import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored tv show" })
export class TvShow {
  @Field()
  finished: boolean;

  @Field(() => ID)
  tapeId: number;
}
