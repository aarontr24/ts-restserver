import { Router } from 'express';
import { check } from 'express-validator'
import { deletetUser, getUser, getUsers, createUser, updateUser } from '../controllers/user';
import fieldValidator from '../middlewares/fieldValidator'
import jwtValidator from '../middlewares/jwtValidator';
import { adminValidator, userValidator } from '../middlewares/roleValidator';

const router = Router();

// Create User
router.post(
    '/new',
    [ // middlewares
        check('firstName', 'El nombre es requirido').not().isEmpty(),
        check('lastName', 'El apellido es requirido').not().isEmpty(),
        check('userName', 'El UserName es requirido').not().isEmpty(),
        check('email', 'El email debe ser válido').isEmail(),
        check('password', 'El password es requirido').not().isEmpty(),
        check('dni', 'El DNI es requirido').isLength({min:8, max:8}),
        check('dateOfBirth', 'La fecha debe ser válida').isISO8601().toDate(),
        fieldValidator
    ],   
    createUser
    );

// Update User
router.put(
    '/:id',
    [
        check('firstName', 'El nombre es requirido').not().isEmpty(),
        check('lastName', 'El apellido es requirido').not().isEmpty(),
        check('userName', 'El UserName es requirido').not().isEmpty(),
        check('email', 'El email debe ser válido').isEmail(),
        check('dni', 'El DNI es requirido').isLength({min:8, max:8}),
        check('dateOfBirth', 'La fecha debe ser válida').isISO8601().toDate(),
        fieldValidator,
        jwtValidator,
        userValidator
    ],
    updateUser
    );
router.get('/', [jwtValidator, adminValidator], getUsers);
router.get('/:id', getUser);
router.delete('/:id', [ jwtValidator, adminValidator ], deletetUser);

export default router;