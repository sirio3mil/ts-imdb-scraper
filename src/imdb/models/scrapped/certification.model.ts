import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "parental guide tape certifications" })
export class ScrappedCertification {
  @Field()
  certification: string;

  @Field()
  country: string;
}
