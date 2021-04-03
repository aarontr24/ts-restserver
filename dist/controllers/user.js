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
exports.deletetUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const underscore_1 = __importDefault(require("underscore"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 5;
    try {
        const users = yield User_1.default.find({}, 'firstName lastName nickName email avatar role state')
            .skip(from)
            .limit(limit);
        const countUser = yield User_1.default.count();
        res.status(200).json({
            ok: true,
            users,
            countUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => {
    const { id } = req.params;
    res.json({
        msg: 'getUser',
        id
    });
};
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email, userName } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya esta en uso'
            });
        }
        user = yield User_1.default.findOne({ userName });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya esta en uso'
            });
        }
        user = new User_1.default(req.body);
        const salt = bcrypt_1.default.genSaltSync();
        user.password = bcrypt_1.default.hashSync(password, salt);
        yield user.save();
        // Generate JWT
        const token = yield jwt_1.default(user.id, user.userName);
        return res.status(201).json({
            ok: true,
            user,
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
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { email, userName } = req.body;
    const { id } = req.params;
    const body = underscore_1.default.pick(req.body, ["firstName", "lastName", "userName", "email", "dni", "dateOfBirth"]);
    try {
        let user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id ' + id
            });
        }
        user = yield User_1.default.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' });
        return res.status(201).json({
            ok: true,
            msg: `Usuario ${user === null || user === void 0 ? void 0 : user.userName} actualizado!`
        });
    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) {
            let nameField = Object.keys(error.keyValue);
            if (nameField[0] === 'userName') {
                return res.status(500).json({
                    ok: false,
                    msg: 'El nombre de usuario ya esta en uso'
                });
            }
            if (nameField[0] === 'email') {
                return res.status(500).json({
                    ok: false,
                    msg: 'El correo ya esta en uso'
                });
            }
        }
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        });
    }
});
exports.updateUser = updateUser;
const deletetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id ' + id
            });
        }
        yield user.updateOne({ state: false });
        // user = await User.findByIdAndUpdate({id});
        return res.status(201).json({
            ok: true,
            msg: `Usuario ${user.userName} inhabilitado!`
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
exports.deletetUser = deletetUser;
//# sourceMappingURL=user.js.map