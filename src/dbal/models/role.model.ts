import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "people role" })
export class Role {
  @Field(() => ID)
  roleId: number;

  @Field()
  role: string;
}
