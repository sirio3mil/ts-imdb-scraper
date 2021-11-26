import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Country } from "./country.model";
import { PremiereDetail } from "./premiere-detail.model";

@ObjectType({ description: "premiere" })
export class Premiere {
  @Field({ nullable: true })
  country?: Country;

  @Field()
  date: Date;

  @Field(() => [PremiereDetail], { nullable: true })
  details?: PremiereDetail[];

  @Field({ nullable: true })
  place?: string;

  @Field(() => ID)
  premiereId?: number;

  @Field(() => Int)
  tapeId: number;
}
