import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'underscore';

import User from '../models/User';
import generateJWT from '../helpers/jwt'

export const login = async(req: Request, res: Response ) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales incorrectas - email'
            })
        }

        // Check password
        const validPassword = bcrypt.compareSync( password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas - pass'
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id, user.userName);

        res.json({
            ok: true,
            uid: user.id,
            name: user.userName,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

export const revalidateToken = async(req: Request, res: Response) => {
    const {uid, name } = req;
    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        token
    })
}