import { Field, ID, ObjectType } from "@nestjs/graphql";
import { DbalCountry } from "./country.model";
import { DbalLanguage } from "./language.model";
import { DbalSound } from "./sound.model";
import { DbalTapeDetail } from "./tape-detail.model";

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
}
