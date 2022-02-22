import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUser {
  @Field(() => ID)
  tapeUserId: number;

  tapeId: number;
  userId: number;
}




  
