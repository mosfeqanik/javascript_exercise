import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Loads .env into process.env and makes ConfigService injectable everywhere
    ConfigModule.forRoot({ isGlobal: true }),

    // DB connection is built from config at runtime (not hard-coded)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'crud_db'),
        autoLoadEntities: true,
        // Schema is owned by db/init.sql. In real projects use migrations,
        // never synchronize:true in production (it can drop columns!).
        synchronize: false,
      }),
    }),

    TasksModule,
  ],
})
export class AppModule {}
