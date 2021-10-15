
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ImdbModule } from './imdb/imdb.module';

@Module({
  imports: [
    ImdbModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': true
      },
    }),
  ],
})
export class AppModule {}
