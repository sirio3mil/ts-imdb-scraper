import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "stored language" })
export class DbalLanguage {
  @Field(() => ID)
  languageId?: number;

  @Field()
  name: string;
}
