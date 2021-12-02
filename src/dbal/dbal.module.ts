import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sql from "mssql";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { CountryRepository } from "./repositories/country.repository";
import { LanguageRepository } from "./repositories/language.repository";
import { PeopleRepository } from "./repositories/people.repository";
import { RankingRepository } from "./repositories/ranking.repository";
import { RoleRepository } from "./repositories/role.repository";
import { TitleRepository } from "./repositories/title.repository";
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
    TapeRepository,
    PeopleRepository,
    RankingRepository,
    RoleRepository,
    TitleRepository,
    CountryRepository,
    LanguageRepository,
    connectionFactory,
  ],
  exports: ["CONNECTION"],
})
export class DbalModule {}
