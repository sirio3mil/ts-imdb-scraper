import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import configuration from "./config/configuration";
import { DbalModule } from "./dbal/dbal.module";
import { ImdbModule } from "./imdb/imdb.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Place } from "./dbal/enums/place.enum";

registerEnumType(Place, {
  name: 'Place',
  description: 'The supported places.',
  valuesMap: {
    PrimeVideo: {
      description: 'Amazon Prime Video.',
    },
    HBO: {
      deprecationReason: 'Service no longer available.',
    },
  },
});

@Module({
  imports: [
    ImdbModule,
    DbalModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
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
