import { registerAs } from '@nestjs/config';

/**
 * 数据库配置
 * 从环境变量读取 PostgreSQL 连接信息
 */
export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 't2_program',
}));
