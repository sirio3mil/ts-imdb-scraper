import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored country" })
export class DbalCountry {
  @Field(() => ID)
  countryId?: number;

  @Field({ nullable: true })
  isoCode?: string;

  @Field()
  officialName: string;
}
