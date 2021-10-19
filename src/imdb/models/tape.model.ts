import { Field, ObjectType } from "@nestjs/graphql";
import { Country } from "./country.model";
import { Credit } from "./credit.model";
import { Genre } from "./genre.model";
import { GlobalUniqueObject } from "./guid.model";
import { Language } from "./language.model";
import { TapeDetail } from "./tape-detail.model";

@ObjectType({ description: "tape" })
export class Tape {
  constructor() {
    this.countries = [];
    this.languages = [];
    this.genres = [];
    this.credits = [];
  }

  @Field()
  originalTitle: string;

  @Field()
  detail: TapeDetail;

  @Field(() => [Country])
  countries: Country[];

  @Field(() => [Language])
  languages: Language[];

  @Field(() => [Genre])
  genres: Genre[];

  @Field(() => [Credit])
  credits: Credit[];

  @Field()
  object: GlobalUniqueObject;
}
