import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TapeResolver } from "./tape.resolver";
import { ImdbService } from "./imdb.service";
import { AbstractProvider } from "./providers/abstract.provider";
import { FileProvider } from "./providers/file.provider";
import { DateScalar } from "./scalars/date.scalar";

@Module({
  imports: [HttpModule],
  providers: [
    DateScalar,
    TapeResolver,
    ImdbService,
    {
      provide: AbstractProvider,
      useClass: FileProvider,
    },
  ],
})
export class ImdbModule {}
