import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUserHistoryDetail {
  @Field(() => Int)
  tapeUserHistoryDetailId: number;

  tapeUserHistoryId: number;
  placeId?: number;
}




  
