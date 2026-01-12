import { ValidationError } from 'yup';
import logger from '../utils/logger.js';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ errors: err.errors });
    }
    logger.error('Schema validation error:', err.errors);

    // Verifica si el error es de Yup y retorna 400
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Error de validación de datos',
        errors: err.errors,
      });
    }
    next(err);
  }
};

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
