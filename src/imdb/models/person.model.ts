import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "person" })
export class Person {
  @Field()
  fullName: string

  @Field({ nullable: true })
  alias?: string
}
