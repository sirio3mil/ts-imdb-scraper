import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "premiere" })
export class Premiere {
  @Field()
  country: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  detail?: string;

  @Field({ nullable: true })
  place?: string;
}
