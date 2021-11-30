import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Country } from "./country.model";
import { Genre } from "./genre.model";
import { Language } from "./language.model";
import { Ranking } from "./ranking.model";
import { Sound } from "./sound.model";
import { TapeDetail } from "./tape-detail.model";
import { TapePeopleRole } from "./tape-people-role.model";
import { TvShowChapter } from "./tv-show-chapter.model";
import { TvShow } from "./tv-show.model";

@ObjectType({ description: "stored tape" })
export class Tape {
  @Field()
  originalTitle: string;

  @Field()
  objectId: string;

  @Field(() => ID)
  tapeId?: number;

  @Field({ nullable: true })
  detail?: TapeDetail;

  @Field(() => [Country], { nullable: true })
  countries?: Country[];

  @Field(() => [Sound], { nullable: true })
  sounds?: Sound[];

  @Field(() => [Language], { nullable: true })
  languages?: Language[];

  @Field(() => [Genre], { nullable: true })
  genres?: Genre[];

  @Field(() => [TapePeopleRole], { nullable: true })
  people?: TapePeopleRole[];

  @Field({ nullable: true })
  ranking?: Ranking;

  @Field({ nullable: true })
  tvShow?: TvShow;

  @Field({ nullable: true })
  tvShowChapter?: TvShowChapter;
}
