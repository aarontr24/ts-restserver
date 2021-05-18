import { Request, Response } from 'express';
// import _ from 'underscore';

// import User from '../models/User';
import Refuge from '../models/Refuge';

export const getRefuges = async( req: Request, res: Response ) => {

    const from: number = Number(req.query.from) || 0;
    const limit: number = Number(req.query.limit) || 5;

    try {
        const refuges = await Refuge.find({}) //, 'fullName firstName lastName nickName email avatar role state')
                                .skip(from)
                                .limit(limit);
        const countRefuge = await Refuge.countDocuments();

        res.status(200).json({
            ok: true,
            refuges,
            countRefuge
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        })
    }

}

export const getRefuge = ( req: Request, res: Response ) => {

    const { id } = req.params;

    res.json({
        msg: 'getRefuge',
        id
    })
}

export const createRefuge = async( req: Request, res: Response ) => {

    const { name } = req.body;

    try {
        let refuge = await Refuge.findOne({ name });
        if ( refuge ) {
            return res.status(400).json({
                ok: false,
                msg: 'Este nombre ya esta en uso'
            })
        }

        refuge = new Refuge(req.body);

        refuge.createdFor = req.uid;

        await refuge.save();

        return res.status(201).json({
            ok: true,
            uid: refuge.id,
            name: refuge.name,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

export const updateRefuge = async( req: Request, res: Response ) => {

    const { id } = req.params;
    const body = req.body;

    try {

        let refuge = await Refuge.findById(id);
        
        if ( !refuge ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un refugio con el id ' + id
            })
        }

        refuge = await Refuge.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' } );

        return res.status(201).json({
            ok: true,
            msg: `Usuario ${refuge?.name} actualizado!`
        });
        
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            let nameField = Object.keys(error.keyValue)
            
            if (nameField[0] === 'name') {
                return res.status(500).json({
                    ok: false,
                    msg: 'El nombre ya esta en uso'
                })
            }
        }
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

export const deleteRefuge = async( req: Request, res: Response ) => {

    const { id } = req.params;

    try {
        const refuge = await Refuge.findById(id);
        
        if ( !refuge ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id ' + id
            })
        }
        await refuge.updateOne({state: false});

        // user = await User.findByIdAndUpdate({id});

        return res.status(201).json({
            ok: true,
            msg: `${refuge.name} inhabilitado!`
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}