// Manejador de errores para la API
// Este middleware captura errores y envía una respuesta JSON con el error.

export const errorHandler = (err, req, res, next) => {
  console.error( "Error atrapado:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

