import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger();
        try {
          const dataSource = new DataSource({
            type: 'mongodb',
            url: configService.get('DB_URL'),
            synchronize: true,
            useUnifiedTopology: true,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
          });
          await dataSource.initialize(); // initialize the data source
          logger.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          logger.error(error.message, error.stack);
          logger.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource, ConfigModule],
})
export class TypeOrmModule {}
