import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "parental guide tape certifications" })
export class Certification {
  @Field()
  certification: string;

  @Field()
  country: string;
}
