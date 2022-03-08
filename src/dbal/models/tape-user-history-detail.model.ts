import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Place } from "../../domain/enums/place.enum";

@ObjectType()
export class TapeUserHistoryDetail {
  @Field(() => Int)
  tapeUserHistoryDetailId: number;

  tapeUserHistoryId: number;

  @Field(() => Place, { nullable: true })
  place?: Place;
}




  
