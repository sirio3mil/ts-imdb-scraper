import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginatedInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}
