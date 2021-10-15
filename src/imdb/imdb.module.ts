import { Module } from "@nestjs/common";
import { ImdbResolver } from "./imdb.resolver";
import { ImdbService } from "./imdb.service";

@Module({
  providers: [ImdbResolver, ImdbService],
})
export class ImdbModule {}
