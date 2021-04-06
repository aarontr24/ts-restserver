"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'LEADER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
const validSocialNetwork = {
    values: ['NONE', 'GOOGLE', 'FACEBOOK'],
    message: '{VALUE} no es una red social válida'
};
;
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dni: { type: String },
    dateOfBirth: { type: Date },
    avatar: { type: String },
    socialNetwork: { type: String, default: 'NONE', enum: validSocialNetwork },
    // google: { type: Boolean, default: false },
    // facebook: { type: Boolean, default: false },
    role: { type: String, default: 'USER_ROLE', enum: validRoles },
    state: { type: Boolean, default: true },
    // createdAt: { type: Number },
    // updatedAt: { type: Number }
}, {
    // timestamps: { currentTime: () => Math.floor(Date.now() / 1000 )}
    timestamps: {}
});
// Virtuals
UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
// UserSchema.plugin( uniqueValidator, { message: '{PATH} ya está en uso'} );
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map