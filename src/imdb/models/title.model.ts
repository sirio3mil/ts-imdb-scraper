import { Field, ObjectType } from "@nestjs/graphql";
import { Country } from "./country.model";
import { Language } from "./language.model";

@ObjectType({ description: "tape title" })
export class Title {
  @Field({ nullable: true })
  country?: Country;

  @Field({ nullable: true })
  language?: Language;

  @Field({ nullable: true })
  observations?: string;

  @Field()
  title: string;
}
