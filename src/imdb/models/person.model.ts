import { Field, ObjectType } from "@nestjs/graphql";
import { GlobalUniqueObject } from "./guid.model";

@ObjectType({ description: "person" })
export class Person {
  @Field()
  fullName: string;

  @Field()
  object: GlobalUniqueObject;

  @Field({ nullable: true })
  alias?: string;
}
