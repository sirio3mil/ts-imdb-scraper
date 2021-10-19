import { Field, ObjectType } from "@nestjs/graphql";
import { Imdb } from "./imdb.model";

@ObjectType({ description: "person" })
export class Person {
  @Field()
  fullName: string;

  @Field()
  imdb: Imdb;

  @Field({ nullable: true })
  alias?: string;
}
