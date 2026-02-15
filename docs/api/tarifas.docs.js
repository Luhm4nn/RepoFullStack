/**
 * @swagger
 * /Tarifas:
 *   get:
 *     summary: Obtener todas las tarifas
 *     tags: [Tarifas]
 *     responses:
 *       200:
 *         description: Lista de tarifas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarifa'
 *       500:
 *         description: Error interno del servidor
 *
 * /Tarifa/{id}:
 *   get:
 *     summary: Obtener una tarifa por ID
 *     tags: [Tarifas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarifa
 *     responses:
 *       200:
 *         description: Tarifa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarifa'
 *       404:
 *         description: Tarifa no encontrada
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     summary: Actualizar una tarifa
 *     tags: [Tarifas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarifa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TarifaInput'
 *     responses:
 *       200:
 *         description: Tarifa actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarifa'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Tarifa no encontrada
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     summary: Eliminar una tarifa
 *     tags: [Tarifas]
 *     security:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TarifaInput'
 *     responses:
 *       201:
 *         description: Tarifa creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarifa'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       409:
 *         description: Tarifa ya existente
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     Tarifa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         descripcionTarifa:
 *           type: string
 *           example: "General"
 *         precio:
 *           type: number
 *           example: 1200.5
 *     TarifaInput:
 *       type: object
 *       required:
 *         - descripcionTarifa
 *         - precio
 *       properties:
 *         descripcionTarifa:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "General"
 *         precio:
 *           type: number
 *           minimum: 0.01
 *           example: 1200.5
 */
