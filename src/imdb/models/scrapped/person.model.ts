import { Field, Int, ObjectType } from "@nestjs/graphql";
import { URLScalar } from "src/imdb/scalars/url.scalar";

@ObjectType({ description: "person" })
export class ScrappedPerson {
  @Field()
  fullName: string;

  @Field(() => Int)
  ID: number;

  @Field(() => URLScalar)
  url: URL;

  @Field({ nullable: true })
  alias?: string;
}
