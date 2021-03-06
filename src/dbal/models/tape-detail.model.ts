import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored tape detail" })
export class TapeDetail {
  @Field(() => Float, { nullable: true })
  budget?: number;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  cover?: boolean;

  @Field({ nullable: true })
  adult?: boolean;

  @Field({ nullable: true })
  tvShow?: boolean;

  @Field({ nullable: true })
  tvShowChapter?: boolean;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => Int)
  tapeId: number;
}
