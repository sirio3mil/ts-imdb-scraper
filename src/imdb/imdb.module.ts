import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImdbResolver } from "./imdb.resolver";
import { ImdbService } from "./imdb.service";
import { AbstractProvider } from "./providers/abstract.provider";
import { FileProvider } from "./providers/file.provider";

@Module({
  imports: [HttpModule],
  providers: [
    ImdbResolver, 
    ImdbService, 
    {
      provide: AbstractProvider,
      useClass: FileProvider,
    }
  ],
})
export class ImdbModule {}
