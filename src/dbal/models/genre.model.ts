import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored genre" })
export class Genre {
  @Field(() => Int)
  genreId?: number;

  @Field()
  name: string;
}
