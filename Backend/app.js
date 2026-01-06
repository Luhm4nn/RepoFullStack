import 'dotenv/config';
import express from 'express';
import { indexRoutes } from './index.routes.js';
import { errorHandler } from './Middlewares/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { doubleCsrfProtection } from './config/csrf.js';
import logger from './utils/logger.js';

const app = express();

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
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/logout',
      '/auth/csrf-token',
      '/mercadopago/webhook'
    ];
    
    const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
    const isGetRequest = req.method === 'GET';
    
    if (isPublicRoute || isGetRequest) {
      return next();
    }
    
    return doubleCsrfProtection(req, res, next);
  });
}

app.use(indexRoutes);

app.use(errorHandler);

export default app;
