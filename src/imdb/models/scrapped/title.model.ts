import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "tape title" })
export class ScrappedTitle {
  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  language?: string;

  @Field({ nullable: true })
  observations?: string;

  @Field()
  title: string;
}
