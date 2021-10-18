import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ImdbResolver } from "./imdb.resolver";
import { ImdbService } from "./imdb.service";
import { FileProvider } from "./providers/file.provider";

@Module({
  imports: [HttpModule],
  providers: [ImdbResolver, ImdbService, FileProvider],
})
export class ImdbModule {}
