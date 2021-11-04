import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AbstractProvider } from "./providers/abstract.provider";
import { FileProvider } from "./providers/file.provider";
import { TapeResolver } from "./resolvers/tape.resolver";
import { DateScalar } from "./scalars/date.scalar";
import { CreditService } from "./services/credit.service";
import { LocationService } from "./services/location.service";
import { ReleaseInfoService } from "./services/release-info.service";
import { TapeService } from "./services/tape.service";

@Module({
  imports: [HttpModule],
  providers: [
    DateScalar,
    TapeResolver,
    TapeService,
    CreditService,
    LocationService,
    ReleaseInfoService,
    {
      provide: AbstractProvider,
      useClass: FileProvider,
    },
  ],
})
export class ImdbModule {}
