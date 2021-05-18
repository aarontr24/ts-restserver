


import { Router } from 'express';
import { check } from 'express-validator'
import { createRefuge, getRefuges, getRefuge, updateRefuge, deleteRefuge } from '../controllers/refuge';
import fieldValidator from '../middlewares/fieldValidator'
import jwtValidator from '../middlewares/jwtValidator';
import { adminValidator, leaderRefugeValidator } from '../middlewares/roleValidator';

const router = Router();

// Create User
router.post(
    '/new',
    [ // middlewares
        check('name', 'El nombre es requirido').not().isEmpty(),
        check('creationDate', 'La fecha debe ser válida').isISO8601().toDate(),
        fieldValidator,
        jwtValidator,
        adminValidator,
    ],   
    createRefuge
);

// Update User
router.put(
    '/:id',
    [
        check('name', 'El nombre es requirido').not().isEmpty(),
        check('creationDate', 'La fecha debe ser válida').isISO8601().toDate(),
        fieldValidator,
        jwtValidator,
        leaderRefugeValidator
    ],
    updateRefuge
);
router.get('/', [jwtValidator], getRefuges);
router.get('/:id', getRefuge);
router.delete('/:id', [ jwtValidator, adminValidator ], deleteRefuge);

export default router;