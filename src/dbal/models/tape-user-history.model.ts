import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUserHistory {
  @Field(() => ID)
  tapeUserHistoryId: number;

  tapeUserId: number;
  tapeUserStatusId: number;
}




  
