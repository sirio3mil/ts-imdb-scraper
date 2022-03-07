import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sql from "mssql";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { RankingRepository } from "./repositories/ranking.repository";
import { TapeUserHistoryDetailRepository } from "./repositories/tape-user-history-detail.repository";
import { TapeUserHistoryRepository } from "./repositories/tape-user-history.repository";
import { TapeUserRepository } from "./repositories/tape-user.repository";
import { SeasonUserResolver } from "./resolvers/season-user.resolver";
import { TapeUserHistoryResolver } from "./resolvers/tape-user-history.resolver";
import { TapeUserResolver } from "./resolvers/tape-user.resolver";
import { TapeResolver } from "./resolvers/tape.resolver";

const connectionFactory = {
  provide: "CONNECTION",
  useFactory: async (configService: ConfigService) => {
    const sqlConfig = configService.get<sql.config>("mssql");
    return sql.connect(sqlConfig);
  },
  inject: [ConfigService],
};

@Module({
  imports: [HttpModule],
  providers: [
    TapeResolver,
    TapeUserResolver,
    TapeUserHistoryResolver,
    SeasonUserResolver,
    TapeRepository,
    TapeUserRepository,
    TapeUserHistoryRepository,
    TapeUserHistoryDetailRepository,
    RankingRepository,
    connectionFactory,
  ],
  exports: ["CONNECTION"],
})
export class DbalModule {}
