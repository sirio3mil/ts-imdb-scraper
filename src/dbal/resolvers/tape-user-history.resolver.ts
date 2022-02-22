import {
  Args,
  Int,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { TapeUserHistoryDetail } from "../models/tape-user-history-detail.model";
import { TapeUserHistory } from "../models/tape-user-history.model";
import { TapeUserHistoryDetailRepository } from "../repositories/tape-user-history-detail.repository";


@Resolver(() => TapeUserHistory)
export class TapeUserHistoryResolver {
  constructor(
    private readonly detailRepository: TapeUserHistoryDetailRepository
  ) {}

  @ResolveField(() => TapeUserHistoryDetail)
  async addPlace(@Args("placeId", { type: () => Int }) placeId: number, @Parent() tapeUserHistory: TapeUserHistory): Promise<TapeUserHistoryDetail> {
    return this.detailRepository.insertTapeUserHistoryDetail(tapeUserHistory.tapeUserHistoryId, placeId);
  }
}
