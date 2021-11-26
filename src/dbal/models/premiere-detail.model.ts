import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "premiere observations" })
export class PremiereDetail {
  @Field()
  observation: string;

  @Field(() => Int)
  premiereId: number;

  @Field(() => ID)
  premiereDetailId?: number;
}
