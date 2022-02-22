import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Place } from "../enums/place.enum";

@ObjectType()
export class TapeUserHistoryDetail {
  @Field(() => Int)
  tapeUserHistoryDetailId: number;

  tapeUserHistoryId: number;

  place: Place;
}




  
