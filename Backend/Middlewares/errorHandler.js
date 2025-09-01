// API error handler middleware
// This middleware handles errors from the API, including Prisma-specific errors and general server errors.

export const errorHandler = (err, req, res, next) => {
  let appError = new Error(); // Initialize a new error object to assign properties later
  //this is a unicity error from Prisma
  if (err.code === "P2002") {
    console.error("Error de Prisma: Violación de unicidad.", err.meta);
    appError.status = 409;
    appError.message =
      "Error: violación de unicidad." + " Record: " + err.meta.modelName;
  }
  //this is a foreign key error from Prisma
  if (err.code === "P2003") {
    console.error(
      "Error de Prisma: Registro relacionado no encontrado.",
      err.meta
    );
    appError.status = 404;
    appError.message =
      "Error: registro relacionado no encontrado." +
      " Record: " +
      err.meta.modelName;
  }
  //this is a not found error from Prisma
  if (err.code === "P2025") {
    console.error("Error de Prisma: Registro no encontrado.");
    appError.status = 404;
    appError.message =
      "Error: " + err.meta.cause + " Record: " + err.meta.modelName;
  }
  // Handle other errors releated to 404 status
  if (err.status === 404) {
    console.error("Error 404: ", err.message);
  }
  // Handle other errors
  else {
    console.error("Error interno del servidor:", err);
  }
  // Assign the error properties to the appError object
  const status = appError.status || 500;
  const message = appError.message || "Internal Server Error";
  // finally, send the error response
  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: appError.stack }),
    },
  });
};
