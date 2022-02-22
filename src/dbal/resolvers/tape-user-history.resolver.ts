import {
  Args,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Place } from "../enums/place.enum";
import { TapeUserHistoryDetail } from "../models/tape-user-history-detail.model";
import { TapeUserHistory } from "../models/tape-user-history.model";
import { TapeUserHistoryDetailRepository } from "../repositories/tape-user-history-detail.repository";


@Resolver(() => TapeUserHistory)
export class TapeUserHistoryResolver {
  constructor(
    private readonly detailRepository: TapeUserHistoryDetailRepository
  ) {}

  @ResolveField(() => TapeUserHistoryDetail)
  async addPlace(@Args("place", { type: () => Place }) place: Place, @Parent() tapeUserHistory: TapeUserHistory): Promise<TapeUserHistoryDetail> {
    return this.detailRepository.insertTapeUserHistoryDetail(tapeUserHistory.tapeUserHistoryId, place);
  }
}
