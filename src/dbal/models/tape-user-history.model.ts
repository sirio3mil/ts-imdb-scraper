import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TapeUserStatus } from "../enums/tape-user-status.enum";

@ObjectType()
export class TapeUserHistory {
  @Field(() => Int)
  tapeUserHistoryId: number;

  tapeUserId: number;
  
  tapeUserStatus: TapeUserStatus;
}




  
