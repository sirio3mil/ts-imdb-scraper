import { Field, ID, ObjectType } from "@nestjs/graphql";
import { People } from "src/dbal/models/people.model";
import { Role } from "src/dbal/models/role.model";

@ObjectType({ description: "tape people role output" })
export class CreditOutput {
  @Field()
  people: People;

  @Field()
  role: Role;

  @Field(() => ID)
  tapePeopleRoleId?: number;

  @Field({ nullable: true })
  character?: string;
}
