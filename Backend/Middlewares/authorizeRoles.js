/**
 * Middleware para restringir el acceso a rutas basado en el rol del usuario.
 * Debe ejecutarse después de `authMiddleware`.
 * 
 * @param {...string} rolesPermitidos - Lista de roles que tienen permiso para acceder.
 * @returns {Function} Middleware de Express que verifica el rol del usuario.
 */
export function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }
    next();
  };
}
