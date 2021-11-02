import { Field, ObjectType } from "@nestjs/graphql";
import { Country } from "./country.model";

@ObjectType({ description: "premiere" })
export class Premiere {
  @Field()
  country: Country;

  @Field()
  date: Date;

  @Field({ nullable: true })
  detail?: string;

  @Field({ nullable: true })
  place?: string;
}
