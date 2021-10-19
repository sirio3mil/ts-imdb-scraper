import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "language" })
export class Language {
  @Field()
  name: string;
}
