import { Field, ObjectType } from "@nestjs/graphql";
import { TapeDetail } from "./tape-detail.model";

@ObjectType({ description: "tape" })
export class Tape {
  @Field()
  originalTitle: string;

  @Field()
  detail: TapeDetail;
}
