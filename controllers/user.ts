import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'underscore';

import User from '../models/User';
import generateJWT from '../helpers/jwt'

export const getUsers = async( req: Request, res: Response ) => {

    const from: number = Number(req.query.from) || 0;
    const limit: number = Number(req.query.limit) || 5;

    try {
        const users = await User.find({}, 'firstName lastName nickName email avatar role state')
                                .skip(from)
                                .limit(limit);
        const countUser = await User.count();

        res.status(200).json({
            ok: true,
            users,
            countUser
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        })
    }

}

export const getUser = ( req: Request, res: Response ) => {

    const { id } = req.params;

    res.json({
        msg: 'getUser',
        id
    })
}

export const createUser = async( req: Request, res: Response ) => {

    const { password, email, userName } = req.body;

    try {
        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya esta en uso'
            })
        }

        user = await User.findOne({ userName });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya esta en uso'
            })
        }
        
        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generate JWT
        const token = await generateJWT(user.id, user.userName);

        return res.status(201).json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

export const updateUser = async( req: Request, res: Response ) => {

    // const { email, userName } = req.body;
    const { id } = req.params;
    const body = _.pick(req.body, ["firstName", "lastName", "userName", "email", "dni", "dateOfBirth"]);

    try {

        let user = await User.findById(id);
        
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id ' + id
            })
        }

        user = await User.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' } );

        return res.status(201).json({
            ok: true,
            msg: `Usuario ${user?.userName} actualizado!`
        });
        
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            let nameField = Object.keys(error.keyValue)
            
            if (nameField[0] === 'userName') {
                return res.status(500).json({
                    ok: false,
                    msg: 'El nombre de usuario ya esta en uso'
                })
            }
            if (nameField[0] === 'email') {
                return res.status(500).json({
                    ok: false,
                    msg: 'El correo ya esta en uso'
                })
            } 
        }
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

export const deletetUser = async( req: Request, res: Response ) => {

    const { id } = req.params;

    try {
        const user = await User.findById(id);
        
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id ' + id
            })
        }
        await user.updateOne({state: false});

        // user = await User.findByIdAndUpdate({id});

        return res.status(201).json({
            ok: true,
            msg: `Usuario ${user.userName} inhabilitado!`
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

