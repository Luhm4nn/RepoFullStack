import express from "express";
import { indexRoutes } from "./index.routes.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import { iniciarCronFunciones } from "./jobs/funcionesCron.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(indexRoutes);

app.use(errorHandler);


iniciarCronFunciones();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
