/**
 * @swagger
 * /mercadopago/create-preference:
 *   post:
 *     summary: Crear preferencia de pago en MercadoPago
 *     tags: [Mercadopago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reserva:
 *                 type: object
 *                 description: Datos de la reserva
 *               asientos:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Asientos reservados
 *     responses:
 *       200:
 *         description: Preferencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de preferencia de MercadoPago
 *       400:
 *         description: Reserva no disponible o datos inválidos
 *       401:
 *         description: No autorizado
 *       429:
 *         description: Demasiadas solicitudes (rate limit)
 *       500:
 *         description: Error interno del servidor
 *
 * /mercadopago/webhooks:
 *   post:
 *     summary: Webhook de MercadoPago para pagos
 *     tags: [Mercadopago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook recibido correctamente
 *       500:
 *         description: Error interno del servidor
 */
