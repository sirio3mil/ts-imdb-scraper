import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TapeUserStatus {
  @Field(() => ID)
  tapeUserStatusId: number;

  @Field()
  description: string;
}




  
