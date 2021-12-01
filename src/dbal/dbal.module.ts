import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sql from "mssql";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { PeopleRepository } from "./repositories/people.repository";
import { RankingRepository } from "./repositories/ranking.repository";
import { RoleRepository } from "./repositories/role.repository";
import { PeopleResolver } from "./resolvers/people.resolver";
import { TapePeopleRoleResolver } from "./resolvers/tape-people-role.resolver";
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
    TapePeopleRoleResolver,
    PeopleResolver,
    TapeRepository,
    PeopleRepository,
    RankingRepository,
    RoleRepository,
    connectionFactory,
  ],
  exports: ["CONNECTION"],
})
export class DbalModule {}
