import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../env';
import { User } from '../modules/user/user.entity';
import { Blog } from '../modules/blog/blog.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.DB.host,
    port: env.DB.port,
    username: env.DB.username,
    password: env.DB.password,
    database: env.DB.database,
    synchronize: true, // in production, set to false and use migration scripts
    logging: true, // in production, set to false
    entities: [User, Blog],
});
