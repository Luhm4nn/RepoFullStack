import express from 'express';
import { indexRoutes } from './routes/index.routes.js';

const app = express();
const PORT = 4000;

app.use(indexRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});