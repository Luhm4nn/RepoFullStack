import express from 'express';
import { indexRoutes } from './index.routes.js';
import { errorHandler } from './Middlewares/errorHandler.js';
import { iniciarCronFunciones } from './jobs/funcionesCron.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Helmet PRIMERO - Configura headers de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS después de Helmet
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://localhost:5173',
    credentials: true,
  })
);

// Parsers
app.use(express.json());
app.use(cookieParser());

app.use(indexRoutes);

app.use(errorHandler);

iniciarCronFunciones();

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
