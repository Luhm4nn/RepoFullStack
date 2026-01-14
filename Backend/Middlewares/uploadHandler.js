import { uploadMoviePoster, uploadToCloudinary } from '../config/cloudinary.js';
import logger from '../utils/logger.js';

export const handleMoviePosterUpload = (req, res, next) => {
  const upload = uploadMoviePoster.single('portada');

  upload(req, res, async (err) => {
    try {
      if (err) {
        logger.error('Error uploading poster:', err.message);
        return res.status(400).json({ error: err.message });
      }

      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file);
          req.body.portada = result.secure_url;
          req.body.portadaPublicId = result.public_id;
          logger.debug('Poster uploaded successfully:', result.secure_url);
        } catch (uploadError) {
          logger.error('Error uploading to Cloudinary:', uploadError.message);
          return res.status(400).json({ error: 'Error uploading poster to Cloudinary' });
        }
      } else {
        // Si no hay archivo, está bien (puede ser una actualización sin cambiar portada)
        logger.debug('No poster file provided');
      }

      next();
    } catch (error) {
      logger.error('Unexpected error in handleMoviePosterUpload:', error.message);
      next(error);
    }
  });
};
