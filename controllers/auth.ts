import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'underscore';

import User from '../models/User';
import generateJWT from '../helpers/jwt'

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        // Check user disabled
        if ( user.state === false ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario inhabilitado!'
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id, user.userName, user.fullName, user.role, user.state);

        res.json({
            ok: true,
            uid: user.id,
            username: user.userName,
            fullname: user.fullName,
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
    const { uid, username, fullname, role, state } = req;
    const token = await generateJWT( uid, username, fullname, role, state );
    res.json({
        ok: true,
        token
    })
}

// Config Google

async function verify( token: string ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
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
    }
    
}
// verify().catch(console.error);

export const loginGoogle = async (req: Request, res: Response) => {

    const token = req.body.idtoken;
    let googleUser;

    try {
        googleUser = await verify(token);
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            ok: false,
            msg: 'Ocurrio un error'
        })
        
    }

    try {
        let user = await User.findOne({ email: googleUser.email });
        if ( user ) {
            // Check user disabled
            if ( user.state === false ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario inhabilitado!'
                })
            }

            if (user.socialNetwork === 'NONE') {
                return res.status(400).json({
                    ok: false,
                    msg: 'Cuenta creada por login normal'
                })
            } else {
                // Generate JWT
                const token = await generateJWT(user.id, user.userName, user.fullName, user.role, user.state);
                return res.status(400).json({
                    ok: true,
                    uid: user.id,
                    username: user.userName,
                    fullname: user.fullName,
                    token
                })
            }
        } else {
            const user = new User;

            user.firstName = googleUser.firstName;
            user.lastName = googleUser.LastName;
            user.userName = `${googleUser.firstName}${Date.now().toString()}`
            user.email = googleUser.email;
            user.avatar = googleUser.avatar;
            user.socialNetwork = googleUser.socialNetwork;
            user.password = ':)';

            user.save()
            const token = await generateJWT(user.id, user.userName, user.fullName, user.role, user.state);
            return res.status(400).json({
                ok: true,
                uid: user.id,
                username: user.userName,
                fullname: user.fullName,
                token
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }
  
}