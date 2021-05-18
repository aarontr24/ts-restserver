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

export const leaderValidator: RequestHandler = ( req: Request, res: Response, next) => {

    const role = req.role;

    if (role !== 'LEADER_ROLE') {
        return res.json({
            ok: false,
            msg: 'No tiene permisos para realizar esta acción'
        })
    }
    
    next();
}

export const myselfValidator: RequestHandler = ( req: Request, res: Response, next) => {

    const userId = req.params.id;

    if (userId === req.uid || req.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            msg: 'No tiene permisos para realizar esta acción'
        })
    }
}

export const leaderRefugeValidator: RequestHandler = ( req: Request, res: Response, next) => {

    const leaderIds = req.body.leaders;

    if (leaderIds.includes(req.uid) || req.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            msg: 'No tiene permisos para realizar esta acción'
        })
    }
}
