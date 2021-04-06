"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const fieldValidator_1 = __importDefault(require("../middlewares/fieldValidator"));
const jwtValidator_1 = __importDefault(require("../middlewares/jwtValidator"));
const router = express_1.Router();
// Login
router.post('/', [
    express_validator_1.check('email', 'El email debe ser válido').isEmail(),
    express_validator_1.check('password', 'El password es requirido').not().isEmpty(),
    fieldValidator_1.default
], auth_1.login);
// Renew token
router.get('/renew', jwtValidator_1.default, auth_1.revalidateToken);
router.post('/google', auth_1.loginGoogle);
exports.default = router;
//# sourceMappingURL=auth.js.map