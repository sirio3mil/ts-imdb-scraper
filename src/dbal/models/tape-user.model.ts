import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUser {
  @Field(() => Int)
  tapeUserId: number;

  @Field(() => Int)
  tapeId: number;

  @Field(() => Int)
  userId: number;
}




  
