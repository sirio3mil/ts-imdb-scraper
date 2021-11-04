import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "person" })
export class Person {
  @Field()
  fullName: string;

  @Field(() => Int)
  ID: number;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  alias?: string;
}
