import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import configuration from "./config/configuration";
import { ImdbModule } from "./imdb/imdb.module";

@Module({
  imports: [
    ImdbModule,
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql",
      subscriptions: {
        "graphql-ws": true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}
