import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sql from "mssql";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { RankingRepository } from "./repositories/ranking.repository";
import { DbalTapeResolver } from "./resolvers/tape.resolver";

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
    DbalTapeResolver,
    TapeRepository,
    RankingRepository,
    connectionFactory,
  ],
  exports: ["CONNECTION"],
})
export class DbalModule {}
