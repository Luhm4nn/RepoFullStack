/**
 * @swagger
 * /Sala/{idSala}/Asientos:
 *   get:
 *     summary: Obtener todos los asientos de una sala
 *     tags: [Asientos]
 *     parameters:
 *       - in: path
 *         name: idSala
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Lista de asientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asiento'
 *       404:
 *         description: No existen asientos cargados para esa sala
 *       500:
 *         description: Error interno del servidor
 *
 * /Sala/{idSala}/Asientos/{filaAsiento}/{nroAsiento}:
 *   get:
 *     summary: Obtener un asiento específico
 *     tags: [Asientos]
 *     parameters:
 *       - in: path
 *         name: idSala
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *       - in: path
 *         name: filaAsiento
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 1
 *         required: true
 *         description: Fila del asiento (letra)
 *       - in: path
 *         name: nroAsiento
 *         schema:
 *           type: integer
 *         required: true
 *         description: Número de asiento
 *     responses:
 *       200:
 *         description: Asiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asiento'
 *       404:
 *         description: Asiento no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     summary: Actualizar un asiento
 *     tags: [Asientos]
 *     parameters:
 *       - in: path
 *         name: idSala
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *       - in: path
 *         name: filaAsiento
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 1
 *         required: true
 *         description: Fila del asiento (letra)
 *       - in: path
 *         name: nroAsiento
 *         schema:
 *           type: integer
 *         required: true
 *         description: Número de asiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsientoUpdateInput'
 *     responses:
 *       200:
 *         description: Asiento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asiento'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Asiento no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     summary: Eliminar un asiento
 *     tags: [Asientos]
 *     parameters:
 *       - in: path
 *         name: idSala
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *       - in: path
 *         name: filaAsiento
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 1
 *         required: true
 *         description: Fila del asiento (letra)
 *       - in: path
 *         name: nroAsiento
 *         schema:
 *           type: integer
 *         required: true
 *         description: Número de asiento
 *     responses:
 *       200:
 *         description: Asiento eliminado correctamente
 *       404:
 *         description: Asiento no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 * /Sala/{idSala}/Asiento:
 *   post:
 *     summary: Crear un asiento individual
 *     tags: [Asientos]
 *     parameters:
 *       - in: path
 *         name: idSala
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsientoCreateInput'
 *     responses:
 *       201:
 *         description: Asiento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asiento'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     Asiento:
 *       type: object
 *       properties:
 *         idSala:
 *           type: integer
 *           example: 1
 *         filaAsiento:
 *           type: string
 *           example: "A"
 *         nroAsiento:
 *           type: integer
 *           example: 5
 *         tipoAsiento:
 *           type: string
 *           example: "VIP"
 *     AsientoCreateInput:
 *       type: object
 *       required:
 *         - filaAsiento
 *         - nroAsiento
 *         - tipoAsiento
 *       properties:
 *         filaAsiento:
 *           type: string
 *           minLength: 1
 *           maxLength: 1
 *           example: "A"
 *         nroAsiento:
 *           type: integer
 *           minimum: 1
 *           maximum: 25
 *           example: 5
 *         tipoAsiento:
 *           type: string
 *           enum: [VIP, STANDARD]
 *           example: "VIP"
 *     AsientoUpdateInput:
 *       type: object
 *       properties:
 *         tipoAsiento:
 *           type: string
 *           enum: [VIP, STANDARD]
 *           example: "STANDARD"
 */
