import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PeopleAlias } from "./people-alias.model";
import { PeopleDetail } from "./people-detail.model";

@ObjectType({ description: "people main model" })
export class People {
  @Field(() => [PeopleAlias], { nullable: true })
  aliases?: PeopleAlias[];

  @Field({ nullable: true })
  detail?: PeopleDetail;

  @Field()
  fullName: string;

  @Field()
  objectId: string;

  @Field(() => Int)
  peopleId?: number;
}
