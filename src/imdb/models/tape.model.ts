import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ScrappedCertification } from "./certification.model";
import { ScrappedCredit } from "./credit.model";
import { ScrappedEpisode } from "./episode.model";
import { ScrappedPremiere } from "./premiere.model";
import { ScrappedRanking } from "./ranking.model";
import { ScrappedTitle } from "./title.model";

@ObjectType({ description: "tape" })
export class ScrappedTape {
  @Field()
  originalTitle: string;

  @Field({ nullable: true })
  budget?: number;

  @Field(() => [String], { nullable: true })
  colors?: string[];

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

  @Field(() => [String], { nullable: true })
  countries?: string[];

  @Field(() => [String], { nullable: true })
  languages?: string[];

  @Field(() => [String], { nullable: true })
  genres?: string[];

  @Field(() => [String], { nullable: true })
  sounds?: string[];

  @Field(() => [String], { nullable: true })
  locations?: string[];

  @Field(() => [ScrappedCredit], { nullable: true })
  credits?: ScrappedCredit[];

  @Field(() => [ScrappedPremiere], { nullable: true })
  premieres?: ScrappedPremiere[];

  @Field(() => [ScrappedTitle], { nullable: true })
  titles?: ScrappedTitle[];

  @Field(() => [ScrappedCertification], { nullable: true })
  certifications?: ScrappedCertification[];

  @Field(() => [String], { nullable: true })
  keywords?: string[];

  @Field(() => Int)
  ID: number;

  @Field()
  url: URL;

  @Field({ nullable: true })
  ranking?: ScrappedRanking;

  @Field({ nullable: true })
  episode?: ScrappedEpisode;
}
