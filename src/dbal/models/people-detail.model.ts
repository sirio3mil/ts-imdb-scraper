import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Country } from "./country.model";

@ObjectType({ description: "people detailed information" })
export class PeopleDetail {
  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  birthPlace?: string;

  @Field({ nullable: true })
  country?: Country;

  @Field({ nullable: true })
  deathDate?: Date;

  @Field({ nullable: true })
  deathPlace?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  havePhoto?: boolean;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => ID)
  peopleId: number;

  @Field({ nullable: true })
  skip?: boolean;
}
