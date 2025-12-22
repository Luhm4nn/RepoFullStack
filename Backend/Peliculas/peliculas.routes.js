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
import { validateBody } from '../Middlewares/validateRequest.js';
import { peliculaSchema } from '../validations/PeliculasSchema.js';
import { authorizeRoles } from '../Middlewares/authorizeRoles.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = Router();

router.get('/Peliculas', asyncHandler(getPeliculas));
router.get('/Peliculas/search', asyncHandler(searchPeliculas));
router.get('/Pelicula/:id', asyncHandler(getPelicula));
router.get('/Peliculas/cartelera', asyncHandler(getPeliculasEnCartelera));
router.get('/Peliculas/cartelera/count', asyncHandler(getCountPeliculasEnCartelera));

router.post(
  '/Pelicula',
  authMiddleware,
  authorizeRoles('ADMIN'),
  handleMoviePosterUpload,
  validateBody(peliculaSchema),
  asyncHandler(createPelicula)
);

router.put(
  '/Pelicula/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  handleMoviePosterUpload,
  validateBody(peliculaSchema),
  asyncHandler(updatePelicula)
);

router.delete('/Pelicula/:id', authMiddleware, authorizeRoles('ADMIN'), asyncHandler(deletePelicula));

export const peliculasRoutes = router;