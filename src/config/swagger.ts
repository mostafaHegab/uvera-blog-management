// src/config/swagger.ts
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Uvera Blog API',
            version: '1.0.0',
            description: 'A simple blog management API',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: '/api/v1',
            },
        ],
    },
    apis: ['./src/modules/**/*.ts'], // adjust to your folders
};

export const setupSwagger = (app: Express) => {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
