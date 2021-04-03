import { Router } from 'express';
import { check } from 'express-validator'
import { login, revalidateToken } from '../controllers/auth';
import fieldValidator from '../middlewares/fieldValidator'
import jwtValidator from '../middlewares/jwtValidator';

const router = Router();

// Login
router.post(
    '/',
    [
        check('email', 'El email debe ser válido').isEmail(),
        check('password', 'El password es requirido').not().isEmpty(),
        fieldValidator
    ],
    login
)

// Renew token
router.get(
    '/renew',
    jwtValidator,
    revalidateToken
)

export default router;