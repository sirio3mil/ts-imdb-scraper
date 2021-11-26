import { Field, ObjectType } from "@nestjs/graphql";
import { ScrappedPerson } from "./person.model";

@ObjectType({ description: "credit, cast and crew member" })
export class ScrappedCredit {
  @Field()
  person: ScrappedPerson;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  character?: string;
}
