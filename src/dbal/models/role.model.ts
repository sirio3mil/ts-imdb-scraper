import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "people role" })
export class Role {
  @Field(() => Int)
  roleId: number;

  @Field()
  role: string;
}
