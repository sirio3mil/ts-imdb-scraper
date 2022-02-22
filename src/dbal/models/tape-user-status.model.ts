import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUserStatus {
  @Field(() => Int)
  tapeUserStatusId: number;

  @Field()
  description: string;
}




  
