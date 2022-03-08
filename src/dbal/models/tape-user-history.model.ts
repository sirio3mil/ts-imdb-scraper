import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TapeUserStatus } from "../../domain/enums/tape-user-status.enum";

@ObjectType()
export class TapeUserHistory {
  @Field(() => Int)
  tapeUserHistoryId: number;

  tapeUserId: number;
  
  tapeUserStatus: TapeUserStatus;
}




  
