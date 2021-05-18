import mongoose, { Document, Schema } from 'mongoose';
import { validCity } from './Pet';

export interface IRefuge extends Document {
    name: string,
    phone: string,
    movil: string,
    address: string,
    urlPage: string,
    description: string,
    quotas: number,
    leaders: [string],
    creationDate: string,
    city: string,
    imgs: [string],
    state: boolean,
    createdFor: string,
    createAt: number,
    updateAt: number
};

const RefugeSchema: Schema = new Schema({

    name: { type: String, required: true, unique: true },
    phone: { type: String },
    movil: { type: String },
    address: { type: String },
    urlPage: { type: String },
    description: { type: String },
    quotas: { type: Number },
    leaders: { type: [{ type: Schema.Types.ObjectId, ref: 'User'}], required: true, validate: (v: Schema.Types.ObjectId) => Array.isArray(v) && v.length > 0, },
    creationDate: { type: Date },
    city: { type: String, enum: validCity },
    imgs: { type: [String] },
    state: { type: Boolean, default: true },
    createdFor: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: {}
});

export default mongoose.model<IRefuge>('Refuge', RefugeSchema);