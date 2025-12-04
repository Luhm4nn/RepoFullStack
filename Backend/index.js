import app from './app.js';
import { iniciarCronFunciones } from './jobs/funcionesCron.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 4000;

iniciarCronFunciones();

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
