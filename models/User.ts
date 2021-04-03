
import mongoose, { Document, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const validSocialNetwork = {
    values: ['WEB', 'GOOGLE', 'FACEBOOK'],
    message: '{VALUE} no es una red social válida'
}

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    dni: string,
    avatar: string,
    dateOfBirth: string,
    socialNetwork: string,
    // google: boolean,
    // facebook: boolean,
    role: string,
    state: boolean,
    createAt: number,
    updateAt: number

};

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dni: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    avatar: { type: String },
    socialNetwork: { type: String, default: 'WEB', enum: validSocialNetwork },
    // google: { type: Boolean, default: false },
    // facebook: { type: Boolean, default: false },
    role : { type: String, default: 'USER_ROLE',  enum: validRoles },
    state: { type: Boolean, default: true },
    
    // createdAt: { type: Number },
    // updatedAt: { type: Number }

}, {
    // timestamps: { currentTime: () => Math.floor(Date.now() / 1000 )}
    timestamps: {}
});

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject: any = user.toObject();
    delete userObject.password;

    return userObject;
}

// UserSchema.plugin( uniqueValidator, { message: '{PATH} ya está en uso'} );

export default mongoose.model<IUser>('User', UserSchema);


