import { Field, ObjectType } from "@nestjs/graphql";
import { Person } from "./person.model";

@ObjectType({ description: "cast member" })
export class Member {
  @Field()
  person: Person

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  character?: string
}
