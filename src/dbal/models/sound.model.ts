import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored sound" })
export class Sound {
  @Field()
  description: string;

  @Field(() => Int)
  soundId?: number;
}
