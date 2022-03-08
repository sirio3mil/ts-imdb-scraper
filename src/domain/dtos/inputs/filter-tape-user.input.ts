import { Field, InputType, Int } from "@nestjs/graphql";
import { Place } from "src/domain/enums/place.enum"
import { TapeUserStatus } from "src/domain/enums/tape-user-status.enum";
import { PaginatedInput } from "./paginated.input"

@InputType()
export class FilterTapeUserInput extends PaginatedInput {
  @Field(() => Int)
  userId: number;

  @Field({nullable: true})
  place: Place;

  @Field({nullable: true})
  tapeUserStatus: TapeUserStatus;

  @Field({nullable: true})
  finished: boolean;
  
  @Field({nullable: true})
  isTvShow: boolean;
  
  @Field({nullable: true})
  visible: boolean;
}
