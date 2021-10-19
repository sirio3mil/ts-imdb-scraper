import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "imdb number" })
export class ImdbNumber {
  @Field(() => Int)
  imdbNumber: number
  
  @Field({ nullable: true })
  url?: string
}
