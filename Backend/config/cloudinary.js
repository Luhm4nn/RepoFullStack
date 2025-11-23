import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️ Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

const moviePostersStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cutzy/posters',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 500, height: 750, crop: 'fill' },
    ],
  },
});

export const uploadMoviePoster = multer({
  storage: moviePostersStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log('Processing movie poster:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
});

export { cloudinary };
