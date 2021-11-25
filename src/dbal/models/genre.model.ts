import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored genre" })
export class Genre {
  @Field(() => ID)
  genreId?: number;

  @Field()
  name: string;
}
