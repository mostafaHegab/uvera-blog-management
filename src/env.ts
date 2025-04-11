import dotenv from 'dotenv';
dotenv.config();

interface ENV {
    PORT: number;
    DB: {
        url: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    JWT: {
        SECRET: string;
        EXPIRE: number;
    };
    NODE_ENV: string;
    REDIS_URL: string;
}

export const env: ENV = {
    PORT: +process.env.PORT! || 3000,
    DB: {
        url: process.env.DB_URL!,
        host: process.env.DB_HOST!,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
    },
    JWT: {
        SECRET: process.env.JWT_SECRET!,
        EXPIRE: +process.env.JWT_EXPIRE!,
    },
    NODE_ENV: process.env.NODE_ENV || 'local',
    REDIS_URL: process.env.REDIS_URL!,
};
