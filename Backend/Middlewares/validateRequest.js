import { ValidationError } from "yup";

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
