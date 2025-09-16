// Middleware de autorización por rol
export function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
    }
    next();
  };
}
