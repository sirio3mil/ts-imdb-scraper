import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Country } from "src/dbal/models/country.model";

@ObjectType({ description: "tape certification output" })
export class CertificationOutput {
  @Field()
  certification: string;

  @Field({ nullable: true })
  country?: Country;

  @Field(() => Int)
  tapeCertificationId: number;
}
