import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "count inserted rows" })
export class Counter {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  added: number;
}
