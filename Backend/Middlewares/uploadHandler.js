import { uploadMoviePoster } from '../config/cloudinary.js';


export const handleMoviePosterUpload = (req, res, next) => {
  const upload = uploadMoviePoster.single('portada'); 
  
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading poster:', err.message);
      return res.status(400).json({ error: err.message });
    }
    

    if (req.file) {
      req.body.portada = req.file.path;
      req.body.portadaPublicId = req.file.filename;
      console.log('Poster uploaded successfully:', req.file.path);
    }
    
    next();
  });
};