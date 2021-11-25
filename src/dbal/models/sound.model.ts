import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored sound" })
export class Sound {
  @Field()
  description: string;

  @Field(() => ID)
  soundId?: number;
}
