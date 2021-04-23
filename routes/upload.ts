import { Router } from 'express';
import { uploadFile, getImage } from '../controllers/upload';
import jwtValidator from '../middlewares/jwtValidator';
import tokenImgValidator from '../middlewares/tokenImgValidator';

const router = Router();

router.put(
    '/:type/:id',
    [
        jwtValidator
    ],
    uploadFile
)

router.get(
    '/:type/:img',
    [
        tokenImgValidator
    ],
    getImage
)

export default router;