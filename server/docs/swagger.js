import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Backend API',
      version: '1.0.0',
      description: 'Backend API documentation'
    },
    servers: [
      { url: 'http://localhost:8080' }
    ],
  },
  apis: ['./route/*.js'], // matches your structure
});
