import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUserHistory {
  @Field(() => Int)
  tapeUserHistoryId: number;

  tapeUserId: number;
  tapeUserStatusId: number;
}




  
