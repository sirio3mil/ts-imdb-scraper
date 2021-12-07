import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Country } from "src/dbal/models/country.model";

@ObjectType({ description: "premiere" })
export class PremiereOutput {
  @Field({ nullable: true })
  country: Country;

  @Field()
  date: Date;

  @Field({ nullable: true })
  place?: string;

  @Field(() => ID)
  premiereId?: number;

  @Field({ nullable: true })
  observation?: string;
}
