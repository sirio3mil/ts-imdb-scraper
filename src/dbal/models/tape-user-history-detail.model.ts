import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUserHistoryDetail {
  @Field(() => ID)
  tapeUserHistoryDetailId: number;

  tapeUserHistoryId: number;
  placeId?: number;
}




  
