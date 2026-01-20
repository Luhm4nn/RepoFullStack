/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idReserva:
 *                     type: integer
 *                   idUsuario:
 *                     type: integer
 *                   idFuncion:
 *                     type: integer
 *                   asientos:
 *                     type: array
 *                     items:
 *                       type: string
 *                   estado:
 *                     type: string
 *                   fechaReserva:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reserva:
 *   post:
 *     summary: Crear una nueva reserva (atómica)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reserva
 *               - asientos
 *             properties:
 *               reserva:
 *                 type: object
 *                 required:
 *                   - idSala
 *                   - fechaHoraFuncion
 *                   - DNI
 *                   - total
 *                   - fechaHoraReserva
 *                 properties:
 *                   idSala:
 *                     type: integer
 *                   fechaHoraFuncion:
 *                     type: string
 *                     format: date-time
 *                   DNI:
 *                     type: integer
 *                   total:
 *                     type: number
 *                   fechaHoraReserva:
 *                     type: string
 *                     format: date-time
 *               asientos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - filaAsiento
 *                     - nroAsiento
 *                   properties:
 *                     filaAsiento:
 *                       type: string
 *                       minLength: 1
 *                       maxLength: 1
 *                     nroAsiento:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reserva/{idSala}/{fechaHoraFuncion}/{DNI}/{fechaHoraReserva}:
 *   put:
 *     summary: Cancelar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSala
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraFuncion
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: path
 *         name: DNI
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraReserva
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */

/**
 * @swagger
 * /reserva/{idSala}/{fechaHoraFuncion}/{DNI}/{fechaHoraReserva}:
 *   delete:
 *     summary: Eliminar una reserva (admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSala
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraFuncion
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: path
 *         name: DNI
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraReserva
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Reserva no encontrada
 */

/**
 * @swagger
 * /reserva/pending/{idSala}/{fechaHoraFuncion}/{DNI}/{fechaHoraReserva}:
 *   delete:
 *     summary: Eliminar una reserva pendiente
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSala
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraFuncion
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: path
 *         name: DNI
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraReserva
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Reserva pendiente eliminada correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */

/**
 * @swagger
 * /reserva/{idSala}/{fechaHoraFuncion}/{DNI}/{fechaHoraReserva}/confirm:
 *   patch:
 *     summary: Confirmar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSala
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraFuncion
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: path
 *         name: DNI
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fechaHoraReserva
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Reserva confirmada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */
