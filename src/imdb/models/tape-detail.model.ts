import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape details" })
export class TapeDetail {
  constructor() {
    this.colors = [];
  }

  @Field({ nullable: true })
  budget?: number;

  @Field(() => [String])
  colors: string[];

  @Field(() => Int, { nullable: true })
  currency?: number;

  @Field(() => Int)
  duration: number;

  @Field({ defaultValue: false })
  isTvShow: boolean;

  @Field({ defaultValue: false })
  isTvShowChapter: boolean;

  @Field(() => Int)
  year: number;
}
