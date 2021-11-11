import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "person" })
export class Person {
  @Field()
  fullName: string;

  @Field(() => Int)
  ID: number;

  @Field()
  url: URL;

  @Field({ nullable: true })
  alias?: string;
}
