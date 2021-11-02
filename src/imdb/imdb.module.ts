import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TapeResolver } from "./resolvers/tape.resolver";
import { TapeService } from "./services/tape.service";
import { AbstractProvider } from "./providers/abstract.provider";
import { FileProvider } from "./providers/file.provider";
import { DateScalar } from "./scalars/date.scalar";
import { CreditService } from "./services/credit.service";
import { PremiereService } from "./services/premiere.service";

@Module({
  imports: [HttpModule],
  providers: [
    DateScalar,
    TapeResolver,
    TapeService,
    CreditService,
    PremiereService,
    {
      provide: AbstractProvider,
      useClass: FileProvider,
    },
  ],
})
export class ImdbModule {}
