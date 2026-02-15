import { uploadMoviePoster, uploadToCloudinary } from '../config/cloudinary.js';
import logger from '../utils/logger.js';

/**
 * Middleware para manejar la subida de pósters de películas a Cloudinary.
 * Procesa el archivo 'portada', lo sube y guarda la URL en `req.body.portada`.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
export const handleMoviePosterUpload = (req, res, next) => {
  const upload = uploadMoviePoster.single('portada');

  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file);
          req.body.portada = result.secure_url;
          req.body.portadaPublicId = result.public_id;
        } catch (uploadError) {
          logger.error('Error uploading to Cloudinary:', uploadError.message);
          return res.status(400).json({ error: 'Error uploading poster to Cloudinary' });
        }
      }

      next();
    } catch (error) {
      logger.error('Unexpected error in handleMoviePosterUpload:', error.message);
      next(error);
    }
  });
};
