import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "genre" })
export class Genre {
  @Field()
  name: string;
}
