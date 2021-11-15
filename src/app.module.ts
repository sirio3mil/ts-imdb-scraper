import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ImdbModule } from "./imdb/imdb.module";
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

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
  ]
})
export class AppModule {}
