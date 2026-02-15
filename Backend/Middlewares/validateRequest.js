import { ValidationError } from 'yup';

/**
 * Validador para el cuerpo de la petición (req.body).
 * @param {Object} schema - Esquema de validación de Yup.
 */
export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
};

/**
 * Validador para los parámetros de la ruta (req.params).
 * @param {Object} schema - Esquema de validación de Yup.
 */
export const validateParams = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.params, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
};

/**
 * Validador para los parámetros de consulta (req.query).
 * @param {Object} schema - Esquema de validación de Yup.
 */
export const validateQuery = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.query, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
};
