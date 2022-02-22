import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored country" })
export class Country {
  @Field(() => Int)
  countryId?: number;

  @Field({ nullable: true })
  isoCode?: string;

  @Field()
  officialName: string;
}
