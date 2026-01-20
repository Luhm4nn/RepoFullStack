import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 4000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Cine',
    version: '1.0.0',
    description: 'Documentación de la API del sistema de cine',
  },
  servers: [
    { url: `http://localhost:${PORT}`, description: 'Servidor local' }
  ],
};

const options = {
  swaggerDefinition,
  apis: ['../docs/api/*.docs.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };