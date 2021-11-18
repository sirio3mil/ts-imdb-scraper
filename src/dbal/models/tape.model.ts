import { DbalCountry } from "./country.model";
import { DbalTapeDetail } from "./tape-detail.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";

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
}
