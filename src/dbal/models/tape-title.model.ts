import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape title" })
export class TapeTitle {
  @Field(() => Int, { nullable: true})
  countryId?: number;

  @Field(() => Int, { nullable: true })
  languageId?: number;

  @Field({ nullable: true })
  observations?: string;

  @Field(() => Int)
  tapeId: number;

  @Field(() => ID)
  tapeTitleId?: number;
  
  @Field()
  title: string;
}
