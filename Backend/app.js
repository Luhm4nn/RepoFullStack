import 'dotenv/config';
import express from 'express';
import { indexRoutes } from './index.routes.js';
import { errorHandler } from './Middlewares/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import './config/cloudinary.js';

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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(indexRoutes);

app.use(errorHandler);

export default app;
