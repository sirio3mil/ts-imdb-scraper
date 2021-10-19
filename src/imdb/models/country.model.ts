import { Field, ObjectType } from "@nestjs/graphql";
import { Language } from "./language.model";

@ObjectType({ description: "country" })
export class Country {
  @Field({ nullable: true })
  isoCode?: string;

  @Field({ nullable: true })
  language?: Language;

  @Field()
  officialName: string;
}
