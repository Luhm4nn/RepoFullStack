/**
 * @swagger
 * /Usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *
 * /Usuario/{dni}:
 *   get:
 *     summary: Obtener un usuario por DNI
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *           pattern: '^\\d{7,8}$'
 *         required: true
 *         description: DNI del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     summary: Actualizar un usuario por DNI
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *           pattern: '^\\d{7,8}$'
 *         required: true
 *         description: DNI del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdateInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     summary: Eliminar un usuario por DNI
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *           pattern: '^\\d{7,8}$'
 *         required: true
 *         description: DNI del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 * /Usuario:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreateInput'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email o DNI ya registrado
 *       429:
 *         description: Demasiadas solicitudes (rate limit)
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         DNI:
 *           type: string
 *           example: "12345678"
 *         nombreUsuario:
 *           type: string
 *           example: "Juan"
 *         apellidoUsuario:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           example: "juan.perez@email.com"
 *         telefono:
 *           type: string
 *           example: "1122334455"
 *         rol:
 *           type: string
 *           example: "USER"
 *     UsuarioCreateInput:
 *       type: object
 *       required:
 *         - DNI
 *         - nombreUsuario
 *         - apellidoUsuario
 *         - email
 *         - contrasena
 *       properties:
 *         DNI:
 *           type: string
 *           pattern: '^\\d{7,8}$'
 *           example: "12345678"
 *         nombreUsuario:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Juan"
 *         apellidoUsuario:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan.perez@email.com"
 *         contrasena:
 *           type: string
 *           minLength: 6
 *           example: "123456"
 *         telefono:
 *           type: string
 *           pattern: '^\\d{8,15}$'
 *           example: "1122334455"
 *     UsuarioUpdateInput:
 *       type: object
 *       properties:
 *         nombreUsuario:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Juan"
 *         apellidoUsuario:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan.perez@email.com"
 *         telefono:
 *           type: string
 *           pattern: '^\\d{8,15}$'
 *           example: "1122334455"
 */
