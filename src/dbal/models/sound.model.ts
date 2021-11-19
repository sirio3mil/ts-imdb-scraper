import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored sound" })
export class DbalSound {
  @Field()
  description: string;

  @Field(() => ID)
  soundId?: number;
}
