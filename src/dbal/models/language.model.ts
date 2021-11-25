import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored language" })
export class Language {
  @Field(() => ID)
  languageId?: number;

  @Field()
  name: string;
}
