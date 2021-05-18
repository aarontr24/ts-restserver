import {Request, Response, RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

const jwtValidator: RequestHandler = ( req: Request, res: Response, next) => {

    interface Itoken {
        uid: string,
        username: string,
        fullname: string,
        role: string,
        state: boolean
    }

    // x-token headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid, username, fullname, role, state } = <Itoken>jwt.verify(
            token,
            process.env.SECRET_JWT_SEED!
        );

        req.uid = uid;
        req.username = username;
        req.fullname = fullname;
        req.role = role;
        req.state = state;
        
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
    
    next();
}

export default jwtValidator;