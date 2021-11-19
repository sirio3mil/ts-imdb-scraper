import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sql from "mssql";
import { CountryRepository } from "src/dbal/repositories/country.repository";
import { GenreRepository } from "src/dbal/repositories/genre.repository";
import { LanguageRepository } from "src/dbal/repositories/language.repository";
import { SoundRepository } from "src/dbal/repositories/sound.repository";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { AbstractProvider } from "./providers/abstract.provider";
import { FileProvider } from "./providers/file.provider";
import { ImdbResolver } from "./resolvers/imdb.resolver";
import { TapeResolver } from "./resolvers/tape.resolver";
import { DateScalar } from "./scalars/date.scalar";
import { URLScalar } from "./scalars/url.scalar";
import { CreditService } from "./services/credit.service";
import { KeywordService } from "./services/keyword.service";
import { LocationService } from "./services/location.service";
import { ParentalGuideService } from "./services/parental-guide.service";
import { ReleaseInfoService } from "./services/release-info.service";
import { TapeService } from "./services/tape.service";

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
    DateScalar,
    URLScalar,
    ImdbResolver,
    TapeResolver,
    TapeService,
    CreditService,
    LocationService,
    ReleaseInfoService,
    ParentalGuideService,
    KeywordService,
    TapeRepository,
    CountryRepository,
    SoundRepository,
    LanguageRepository,
    GenreRepository,
    {
      provide: AbstractProvider,
      useClass: FileProvider,
    },
    connectionFactory,
  ],
  exports: ["CONNECTION"],
})
export class ImdbModule {}
