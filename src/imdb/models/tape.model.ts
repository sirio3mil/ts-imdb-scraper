import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Credit } from "./credit.model";
import { Premiere } from "./premiere.model";
import { Ranking } from "./ranking.model";
import { Title } from "./title.model";

@ObjectType({ description: "tape" })
export class Tape {
  constructor() {
    this.countries = [];
    this.languages = [];
    this.genres = [];
    this.credits = [];
    this.premieres = [];
    this.titles = [];
    this.colors = [];
  }

  @Field()
  originalTitle: string;

  @Field({ nullable: true })
  budget?: number;

  @Field(() => [String])
  colors: string[];

  @Field(() => Int, { nullable: true })
  currency?: number;

  @Field(() => Int)
  duration: number;

  @Field({ defaultValue: false })
  isTvShow: boolean;

  @Field({ defaultValue: false })
  isTvShowChapter: boolean;

  @Field(() => Int)
  year: number;

  @Field(() => [String])
  countries: string[];

  @Field(() => [String])
  languages: string[];

  @Field(() => [String])
  genres: string[];

  @Field(() => [Credit])
  credits: Credit[];

  @Field(() => [Premiere])
  premieres: Premiere[];

  @Field(() => [Title])
  titles: Title[];

  @Field(() => Int)
  ID: number;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  ranking?: Ranking;
}
