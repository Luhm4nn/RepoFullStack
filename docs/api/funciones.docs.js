/**
 * @swagger
 * /funciones:
 *   get:
 *     summary: Obtener todas las funciones
 *     tags: [Funciones]
 *     parameters:
 *       - in: query
 *         name: nombrePelicula
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de película
 *       - in: query
 *         name: nombreSala
 *         schema:
 *           type: string
 *         description: Filtrar por nombre o ubicación de sala
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activa, inactiva, publica]
 *         description: Filtrar por estado
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar desde fecha
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar hasta fecha
 *     responses:
 *       200:
 *         description: Lista de funciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idFuncion:
 *                     type: integer
 *                   idPelicula:
 *                     type: integer
 *                   idSala:
 *                     type: integer
 *                   fechaHoraFuncion:
 *                     type: string
 *                     format: date-time
 *                   estado:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /funcion:
 *   post:
 *     summary: Crear una nueva función
 *     tags: [Funciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idSala
 *               - idPelicula
 *               - fechaHoraFuncion
 *             properties:
 *               idSala:
 *                 type: string
 *               idPelicula:
 *                 type: string
 *               fechaHoraFuncion:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Función creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /funcion/{idSala}/{fechaHoraFuncion}:
 *   put:
 *     summary: Actualizar una función
 *     tags: [Funciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSala
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fechaHoraFuncion
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idSala:
 *                 type: string
 *               idPelicula:
 *                 type: string
 *               fechaHoraFuncion:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Función actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Función no encontrada
 */

/**
 * @swagger
 * /funcion/{idSala}/{fechaHoraFuncion}:
 *   delete:
 *     summary: Eliminar una función
 *     tags: [Funciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSala
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fechaHoraFuncion
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Función eliminada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Función no encontrada
 */
