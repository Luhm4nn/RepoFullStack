/**
 * @swagger
 * /peliculas:
 *   get:
 *     summary: Obtener todas las películas
 *     tags: [Peliculas]
 *     responses:
 *       200:
 *         description: Lista de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPelicula:
 *                     type: integer
 *                   nombrePelicula:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   duracion:
 *                     type: integer
 *                   genero:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   estreno:
 *                     type: string
 *                     format: date
 *                   portadaUrl:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /peliculas/search:
 *   get:
 *     summary: Buscar películas por nombre
 *     tags: [Peliculas]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Nombre o parte del nombre de la película
 *     responses:
 *       200:
 *         description: Lista de películas que coinciden con la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPelicula:
 *                     type: integer
 *                   nombrePelicula:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /pelicula/{id}:
 *   get:
 *     summary: Obtener una película por ID
 *     tags: [Peliculas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Película encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idPelicula:
 *                   type: integer
 *                 nombrePelicula:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 duracion:
 *                   type: integer
 *                 genero:
 *                   type: string
 *                 estado:
 *                   type: string
 *                 estreno:
 *                   type: string
 *                   format: date
 *                 portadaUrl:
 *                   type: string
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /pelicula:
 *   post:
 *     summary: Crear una nueva película
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombrePelicula
 *               - director
 *               - generoPelicula
 *               - duracion
 *             properties:
 *               nombrePelicula:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               director:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               generoPelicula:
 *                 type: string
 *               duracion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 500
 *               fechaEstreno:
 *                 type: string
 *                 format: date
 *               sinopsis:
 *                 type: string
 *                 maxLength: 1000
 *               trailerURL:
 *                 type: string
 *                 format: url
 *               portada:
 *                 type: string
 *                 format: binary
 *               MPAA:
 *                 type: string
 *                 enum: [G, PG, PG-13, R, NC-17]
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /pelicula/{id}:
 *   put:
 *     summary: Actualizar una película
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombrePelicula:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               director:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               generoPelicula:
 *                 type: string
 *               duracion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 500
 *               fechaEstreno:
 *                 type: string
 *                 format: date
 *               sinopsis:
 *                 type: string
 *                 maxLength: 1000
 *               trailerURL:
 *                 type: string
 *                 format: url
 *               portada:
 *                 type: string
 *                 format: binary
 *               MPAA:
 *                 type: string
 *                 enum: [G, PG, PG-13, R, NC-17]
 *     responses:
 *       200:
 *         description: Película actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Película no encontrada
 */

/**
 * @swagger
 * /pelicula/{id}:
 *   delete:
 *     summary: Eliminar una película
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Película eliminada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Película no encontrada
 */