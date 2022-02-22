import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored language" })
export class Language {
  @Field(() => Int)
  languageId?: number;

  @Field()
  name: string;
}
