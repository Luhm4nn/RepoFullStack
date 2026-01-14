import { Router } from 'express';
import {
  getPeliculas,
  getPelicula,
  createPelicula,
  deletePelicula,
  updatePelicula,
  getPeliculasEnCartelera,
  getCountPeliculasEnCartelera,
  searchPeliculas,
} from './peliculas.controllers.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';
import { handleMoviePosterUpload } from '../Middlewares/uploadHandler.js';
import { validateBody, validateQuery, validateParams } from '../Middlewares/validateRequest.js';
import { peliculaSchema } from '../validations/PeliculasSchema.js';
import { searchQuerySchema, idParamSchema } from '../validations/CommonSchemas.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { moderateLimiter } from '../Middlewares/rateLimiter.js';

const router = Router();

router.get('/Peliculas', moderateLimiter, asyncHandler(getPeliculas));
router.get('/Peliculas/search', moderateLimiter, validateQuery(searchQuerySchema), asyncHandler(searchPeliculas));
router.get('/Pelicula/:id', validateParams(idParamSchema), asyncHandler(getPelicula));
router.get('/Peliculas/cartelera', moderateLimiter, asyncHandler(getPeliculasEnCartelera));
router.get('/Peliculas/cartelera/count', asyncHandler(getCountPeliculasEnCartelera));

router.post(
  '/Pelicula',
  authMiddleware,
  authorizeRoles('ADMIN'),
  asyncHandler(handleMoviePosterUpload),
  validateBody(peliculaSchema),
  asyncHandler(createPelicula)
);

router.put(
  '/Pelicula/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  asyncHandler(handleMoviePosterUpload),
  validateBody(peliculaSchema),
  asyncHandler(updatePelicula)
);

router.delete('/Pelicula/:id', authMiddleware, authorizeRoles('ADMIN'), validateParams(idParamSchema), asyncHandler(deletePelicula));

export const peliculasRoutes = router;