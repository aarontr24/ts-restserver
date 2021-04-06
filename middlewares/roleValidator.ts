import {Request, Response, RequestHandler} from 'express';

export const adminValidator: RequestHandler = ( req: Request, res: Response, next) => {

    const role = req.role;

    if (role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            msg: 'No tiene permisos para realizar esta acción'
        })
    }
    
    next();
}

export const userValidator: RequestHandler = ( req: Request, res: Response, next) => {

    const user = req.body.userName;

    if (user === req.username || req.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            msg: 'No tiene permisos para realizar esta acción'
        })
    }

    
}