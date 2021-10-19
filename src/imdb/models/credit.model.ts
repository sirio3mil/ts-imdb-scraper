import { Field, ObjectType } from "@nestjs/graphql";
import { Person } from "./person.model";

@ObjectType({ description: "credit, cast and crew member" })
export class Credit {
  @Field()
  person: Person;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  character?: string;
}
