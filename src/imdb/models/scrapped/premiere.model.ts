import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "premiere" })
export class ScrappedPremiere {
  @Field()
  country: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  detail?: string;

  @Field({ nullable: true })
  place?: string;
}
