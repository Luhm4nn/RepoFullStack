// Manejador de errores para la API
// Este middleware captura errores y envía una respuesta JSON con el error.

export const errorHandler = (err, req, res, next) => {
  if (err.code === "P2002") {
    console.error("Error de Prisma: Violación de unicidad.", err.meta);
    err.status = 409; // Asignar un estado 409 para errores de violación de unicidad
    err.message =
      "Error: violación de unicidad." + " Record: " + err.meta.modelName; // Mensaje de error personalizado
  }
  if (err.code === "P2003") {
    console.error(
      "Error de Prisma: Registro relacionado no encontrado.",
      err.meta
    );
    err.status = 404; // Asignar un estado 404 para errores de registro relacionado no encontrado
    err.message =
      "Error: registro relacionado no encontrado." +
      " Record: " +
      err.meta.modelName; // Mensaje de error personalizado
  }
  if (err.code === "P2025") {
    console.error("Error de Prisma: Registro no encontrado."); // Error específico de Prisma para "Registro no encontrado"
    err.status = 404; // Asignar un estado 404 para errores de registro no encontrado
    err.message = "Error: " + err.meta.cause + " Record: " + err.meta.modelName; // Mensaje de error personalizado
  }
  if (err.status === 404) {
    console.error("Error 404: ", err.message);
  } else {
    console.error("Error interno del servidor:", err);
  }
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
