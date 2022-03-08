import { Field, InputType, Int } from "@nestjs/graphql";
import { Place } from "src/domain/enums/place.enum"
import { TapeUserStatus } from "src/domain/enums/tape-user-status.enum";
import { PaginatedInput } from "./paginated.input"

@InputType()
export class FilterTapeInput extends PaginatedInput {
  @Field(() => Int, {nullable: true})
  userId?: number;

  @Field({nullable: true})
  place?: Place;

  @Field({nullable: true})
  tapeUserStatus?: TapeUserStatus;

  @Field({nullable: true})
  finished?: boolean;
  
  @Field({nullable: true})
  isTvShow?: boolean;

  @Field({nullable: true})
  isTvShowChapter?: boolean;
  
  @Field({nullable: true})
  visible?: boolean;

  @Field(() => Int, {nullable: true})
  tvShowTapeId?: number;

  @Field(() => Int, {nullable: true})
  seasonNumber?: number;
}
