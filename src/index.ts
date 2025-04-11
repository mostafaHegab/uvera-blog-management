// src/index.ts
import express, { NextFunction, Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes';
import blogRoutes from './modules/blog/blog.routes';
import { setupSwagger } from './config/swagger';
import { env } from './env';
import { authMiddleware } from './modules/auth/auth.middleware';
import { AppDataSource } from './db/dataSource';
import { NotFoundError } from './errors/notFoundError';

console.log('ENV VARS', env);

const app = express();
app.use(express.json());

const API_VERSION = 'v1';

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/blogs`, authMiddleware, blogRoutes);
setupSwagger(app);

// 404 handler
app.use((req: Request, res: Response) => {
    throw new NotFoundError('api_not_found');
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // tslint:disable-next-line:no-console
    if (!err.statusCode) console.error(err);
    res.status(err.statusCode || 500).json(err.localizedMessage || { en: 'Internal Server Error', ar: 'خطأ داخلي في الخادم' });
});

AppDataSource.initialize().then(() => {
    // tslint:disable-next-line:no-console
    app.listen(env.PORT, () => console.log(`🚀 Server ready at http://localhost:${env.PORT}`));
});
