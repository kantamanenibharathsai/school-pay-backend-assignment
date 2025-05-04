import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'School Payments API',
            version: '1.0.0',
            description: 'API documentation for School Payments & Dashboard',
        },
        servers: [
            { 
                url: 'https://school-pay-backend-assignment.onrender.com',
                description: 'Local development server'
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
