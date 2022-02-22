import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Country } from "src/dbal/models/country.model";
import { Language } from "src/dbal/models/language.model";

@ObjectType({ description: "tape title output" })
export class TitleOutput {
  @Field({ nullable: true})
  country?: Country;

  @Field({ nullable: true })
  language?: Language;

  @Field({ nullable: true })
  observations?: string;

  @Field(() => Int)
  tapeTitleId?: number;
  
  @Field()
  title: string;
}
