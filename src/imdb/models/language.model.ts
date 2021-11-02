import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "language" })
export class Language {
  constructor(name: string) {
    this.name = name;
  }

  @Field()
  name: string;
}
