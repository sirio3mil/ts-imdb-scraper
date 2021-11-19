import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored genre" })
export class DbalGenre {
  @Field(() => ID)
  genreId?: number;

  @Field()
  name: string;
}
