import {Router} from 'express'
import auth from '../middleware/auth.js';
import uploadImageController from '../controllers/uploadImage.controler.js';
import upload from '../middleware/multer.js';

const uploadRouter = Router();

uploadRouter.post('/upload-image', auth,upload.single('Image') ,uploadImageController)

export default uploadRouter