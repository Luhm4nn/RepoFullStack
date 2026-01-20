/**
 * @swagger
 * /Parametros:
 *   get:
 *     summary: Obtener todos los parámetros
 *     tags: [Parametros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parametro'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *
 * /Parametro/{id}:
 *   get:
 *     summary: Obtener un parámetro por ID
 *     tags: [Parametros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del parámetro
 *     responses:
 *       200:
 *         description: Parámetro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parametro'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     summary: Actualizar un parámetro
 *     tags: [Parametros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del parámetro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParametroInput'
 *     responses:
 *       200:
 *         description: Parámetro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parametro'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     summary: Eliminar un parámetro
 *     tags: [Parametros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del parámetro
 *     responses:
 *       200:
 *         description: Parámetro eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 * /Parametro:
 *   post:
 *     summary: Crear un nuevo parámetro
 *     tags: [Parametros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParametroInput'
 *     responses:
 *       201:
 *         description: Parámetro creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parametro'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       409:
 *         description: Parámetro ya existente
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     Parametro:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         descripcionParametro:
 *           type: string
 *           example: "Tiempo límite de reserva"
 *         valor:
 *           type: number
 *           example: 30
 *     ParametroInput:
 *       type: object
 *       required:
 *         - descripcionParametro
 *         - valor
 *       properties:
 *         descripcionParametro:
 *           type: string
 *           minLength: 1
 *           maxLength: 45
 *           example: "Tiempo límite de reserva"
 *         valor:
 *           type: number
 *           minimum: 1
 *           maximum: 9999
 *           example: 30
 */
