import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored country" })
export class Country {
  @Field(() => ID)
  countryId?: number;

  @Field({ nullable: true })
  isoCode?: string;

  @Field()
  officialName: string;
}
