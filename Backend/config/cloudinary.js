import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import logger from '../utils/logger.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

logger.debug('☁️ Cloudinary configured successfully');

// Usar memory storage y subir a Cloudinary en el middleware
const memoryStorage = multer.memoryStorage();

export const uploadMoviePoster = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    logger.debug('Processing movie poster upload:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
});

export const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'cutzy/posters',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 500, height: 750, crop: 'fill' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

export { cloudinary };
