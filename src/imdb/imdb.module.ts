import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sql from "mssql";
import { CountryRepository } from "./repositories/country.repository";
import { GenreRepository } from "./repositories/genre.repository";
import { LanguageRepository } from "./repositories/language.repository";
import { PeopleRepository } from "./repositories/people.repository";
import { RankingRepository } from "./repositories/ranking.repository";
import { SoundRepository } from "./repositories/sound.repository";
import { TapeRepository } from "./repositories/tape.repository";
import { TitleRepository } from "./repositories/title.repository";
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
import { PremiereRepository } from "./repositories/premiere.repository";
import { LocationRepository } from "./repositories/location.repository";
import { CertificationRepository } from "./repositories/certification.repository";
import { TagRepository } from "./repositories/tag.repository";
import { ImportAggregator } from "./aggregators/import.aggregator";

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
    RankingRepository,
    PeopleRepository,
    TitleRepository,
    PremiereRepository,
    LocationRepository,
    CertificationRepository,
    TagRepository,
    ImportAggregator,
    {
      provide: AbstractProvider,
      useClass: FileProvider,
    },
    connectionFactory,
  ],
  exports: ["CONNECTION"],
})
export class ImdbModule {}
