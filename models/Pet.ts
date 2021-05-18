import mongoose, { Document, Schema } from 'mongoose';

const validSex = {
    values: ['MALE', 'FEMALE'],
    message: '{VALUE} no es un sexo válido'
}

const validSize = {
    values: ['SMALL', 'MEDIUM', 'LARGE'],
    message: '{VALUE} no es un tamaño válido'
}

const validActivity = {
    values: ['LOW', 'MEDIUM', 'HIGH'],
    message: '{VALUE} no es un nivel válido'
}

const validAdoptionType = {
    values: ['IN_ADOPTION', 'ADOPTED', 'SPONSORED'],
    message: '{VALUE} no es un tipo de adopción válido'
}

export const validCity = {
    values: ['AQP', 'PUNO'],
    message: '{VALUE} no es una ciudad válida',
}

export interface IPet extends Document {
    name: string,
    sexo: string,
    size: string,
    activityLevel: string,
    animal: string,
    dateBirthAprox: string,
    furLenght: string,
    description: string,
    history: string,
    refuge: string,
    city: string,
    adoptionType: string,
    human: string,
    imgs: [string],
    state: boolean,
    createAt: number,
    updateAt: number

};

const PetSchema: Schema = new Schema({

    name: { type: String, required: true },
    sexo: { type: String, default: 'MALE', enum: validSex },
    size: { type: String, default: 'MEDIUM', enum: validSize },
    activityLevel: { type: String, default: 'MEDIUM', enum: validActivity },
    animal: { type: String },
    dateBirthAprox: { type: Date },
    furLenght: { type: String },
    description: { type: String },
    history: { type: String },
    refuge: [{ type: Schema.Types.ObjectId, ref: 'Refuge' }],
    city: { type: String, default: 'AQP', enum: validCity },
    adoptionType: { type: String, default: 'IN_ADOPTION', enum: validAdoptionType },
    human: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    imgs: { type: [String] },
    state: { type: Boolean, default: true },

}, {
    // timestamps: { currentTime: () => Math.floor(Date.now() / 1000 )}
    timestamps: {}
});

export default mongoose.model<IPet>('Pet', PetSchema);