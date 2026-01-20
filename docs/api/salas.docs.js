/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Obtener todas las salas
 *     tags: [Salas]
 *     responses:
 *       200:
 *         description: Lista de salas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idSala:
 *                     type: integer
 *                   nombreSala:
 *                     type: string
 *                   ubicacion:
 *                     type: string
 *                   capacidad:
 *                     type: integer
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /salas/search:
 *   get:
 *     summary: Buscar salas por nombre o ubicación
 *     tags: [Salas]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Nombre o ubicación de la sala
 *     responses:
 *       200:
 *         description: Lista de salas que coinciden con la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idSala:
 *                     type: integer
 *                   nombreSala:
 *                     type: string
 *                   ubicacion:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /sala:
 *   post:
 *     summary: Crear una nueva sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreSala
 *               - ubicacion
 *               - filas
 *               - asientosPorFila
 *             properties:
 *               nombreSala:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 45
 *               ubicacion:
 *                 type: string
 *                 enum: [Ala Derecha, Ala Izquierda, Planta Baja, Sótano, Primer Piso]
 *               filas:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 25
 *               asientosPorFila:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 25
 *               vipSeats:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Sala creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /sala/{id}:
 *   put:
 *     summary: Actualizar una sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreSala:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 45
 *               ubicacion:
 *                 type: string
 *                 enum: [Ala Derecha, Ala Izquierda, Planta Baja, Sótano, Primer Piso]
 *               vipSeats:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sala actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Sala no encontrada
 */

/**
 * @swagger
 * /sala/{id}:
 *   delete:
 *     summary: Eliminar una sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Sala eliminada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Sala no encontrada
 */
