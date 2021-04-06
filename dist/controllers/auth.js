"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginGoogle = exports.revalidateToken = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales incorrectas - email'
            });
        }
        // Check password
        const validPassword = bcrypt_1.default.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas - pass'
            });
        }
        // Generate JWT
        const token = yield jwt_1.default(user.id, user.userName, user.fullName, user.role, user.state);
        res.json({
            ok: true,
            uid: user.id,
            username: user.userName,
            fullname: user.fullName,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        });
    }
});
exports.login = login;
const revalidateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, username, fullname, role, state } = req;
    const token = yield jwt_1.default(uid, username, fullname, role, state);
    res.json({
        ok: true,
        token
    });
});
exports.revalidateToken = revalidateToken;
// Config Google
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        return {
            firstName: payload.given_name,
            LastName: payload.family_name,
            email: payload.email,
            avatar: payload.picture,
            socialNetwork: 'GOOGLE'
        };
    });
}
// verify().catch(console.error);
const loginGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.idtoken;
    let googleUser;
    try {
        googleUser = yield verify(token);
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: 'Ocurrio un error'
        });
    }
    try {
        let user = yield User_1.default.findOne({ email: googleUser.email });
        if (user) {
            if (user.socialNetwork === 'NONE') {
                return res.status(400).json({
                    ok: false,
                    msg: 'Este correo ya esta en uso'
                });
            }
            else {
                // Generate JWT
                const token = yield jwt_1.default(user.id, user.userName, user.fullName, user.role, user.state);
                return res.status(400).json({
                    ok: true,
                    uid: user.id,
                    username: user.userName,
                    fullname: user.fullName,
                    token
                });
            }
        }
        else {
            const user = new User_1.default;
            user.firstName = googleUser.firstName;
            user.lastName = googleUser.LastName;
            user.userName = `${googleUser.firstName}${Date.now().toString()}`;
            user.email = googleUser.email;
            user.avatar = googleUser.avatar;
            user.socialNetwork = googleUser.socialNetwork;
            user.password = ':)';
            user.save();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        });
    }
});
exports.loginGoogle = loginGoogle;
//# sourceMappingURL=auth.js.map