import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'tape' })
export class Tape {
  @Field(type => ID)
  tapeId: string;

  @Field()
  originalTitle: string;
}
