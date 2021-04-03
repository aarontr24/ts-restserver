"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = require("../controllers/user");
const fieldValidator_1 = __importDefault(require("../middlewares/fieldValidator"));
const jwtValidator_1 = __importDefault(require("../middlewares/jwtValidator"));
const router = express_1.Router();
// Create User
router.post('/new', [
    express_validator_1.check('firstName', 'El nombre es requirido').not().isEmpty(),
    express_validator_1.check('lastName', 'El apellido es requirido').not().isEmpty(),
    express_validator_1.check('userName', 'El UserName es requirido').not().isEmpty(),
    express_validator_1.check('email', 'El email debe ser válido').isEmail(),
    express_validator_1.check('password', 'El password es requirido').not().isEmpty(),
    express_validator_1.check('dni', 'El DNI es requirido').isLength({ min: 8, max: 8 }),
    express_validator_1.check('dateOfBirth', 'La fecha debe ser válida').isISO8601().toDate(),
    fieldValidator_1.default
], user_1.createUser);
// Update User
router.put('/:id', [
    express_validator_1.check('firstName', 'El nombre es requirido').not().isEmpty(),
    express_validator_1.check('lastName', 'El apellido es requirido').not().isEmpty(),
    express_validator_1.check('userName', 'El UserName es requirido').not().isEmpty(),
    express_validator_1.check('email', 'El email debe ser válido').isEmail(),
    express_validator_1.check('dni', 'El DNI es requirido').isLength({ min: 8, max: 8 }),
    express_validator_1.check('dateOfBirth', 'La fecha debe ser válida').isISO8601().toDate(),
    fieldValidator_1.default,
    jwtValidator_1.default
], user_1.updateUser);
router.get('/', user_1.getUsers);
router.get('/:id', user_1.getUser);
router.delete('/:id', user_1.deletetUser);
exports.default = router;
//# sourceMappingURL=user.js.map