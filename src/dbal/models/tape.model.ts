import { Field, ID, ObjectType } from "@nestjs/graphql";
import { DbalCountry } from "./country.model";
import { DbalGenre } from "./genre.model";
import { DbalLanguage } from "./language.model";
import { DbalRanking } from "./ranking.model";
import { DbalSound } from "./sound.model";
import { DbalTapeDetail } from "./tape-detail.model";
import { DbalTvShowChapter } from "./tv-show-chapter.model";
import { DbalTvShow } from "./tv-show.model";

@ObjectType({ description: "stored tape" })
export class DbalTape {
  @Field()
  originalTitle: string;

  @Field()
  objectId: string;

  @Field(() => ID)
  tapeId?: number;

  @Field({ nullable: true })
  detail?: DbalTapeDetail;

  @Field(() => [DbalCountry], { nullable: true })
  countries?: DbalCountry[];

  @Field(() => [DbalSound], { nullable: true })
  sounds?: DbalSound[];

  @Field(() => [DbalLanguage], { nullable: true })
  languages?: DbalLanguage[];

  @Field(() => [DbalGenre], { nullable: true })
  genres?: DbalGenre[];

  @Field({ nullable: true })
  ranking?: DbalRanking;

  @Field({ nullable: true })
  tvShow?: DbalTvShow;

  @Field({ nullable: true })
  tvShowChapter?: DbalTvShowChapter;
}
