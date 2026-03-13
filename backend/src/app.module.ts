import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 全局配置模块，加载 .env 文件
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // TypeORM 数据库连接（异步读取配置）
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') !== 'production', // 生产环境禁止自动同步
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
