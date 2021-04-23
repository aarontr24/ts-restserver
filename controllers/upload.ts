import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import User from '../models/User';


// interface File {
//     name: string;
//     size: number;
//     type: string;
//     extension: string;
//     content: ArrayBuffer;
//   }

export const uploadFile = async(req: Request, res: Response) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha seleccionado ningún archivo'
        });
    }

    let validTypes = ['users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            type,
            msg: 'Los tipos permitidos son ' + validTypes.join(', ')
        })
    }

    let sampleFile: any = req.files.sampleFile;

    let uploadPath = path.join(__dirname, `../uploads/${type}/`);

    
    let splitName:string[] = sampleFile.name.split('.');
    let extension = splitName[splitName.length - 1]
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    uploadPath = uploadPath + fileName;

    let validExtension = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtension.indexOf( extension ) < 0) {
        return res.status(400).json({
            ok: false,
            ext: extension,
            msg: 'Las extensiones permitidas son ' + validExtension.join(', ')
        })
    }

    // Use the mv() method to place the file somewhere on your server
    try {
        await sampleFile.mv(uploadPath);
        imageUser(id, res, fileName);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador1'
        })
    }

    
}

const imageUser = async( id: string, res: Response, fileName: string) => {
    try {
        let user = await User.findById(id);


        if ( !user ) {
            deleteFile(fileName, 'users');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id ' + id
            })
        }

        deleteFile(user.avatar, 'users');

        user.avatar = fileName;
        await user.save();
        return res.status(201).json({
            ok: true,
            msg: 'Imagen subida con éxito'
        });
        
    } catch (error) {
        deleteFile(fileName, 'users');
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }
}

const deleteFile = (nameImg: string, type: string) => {
    let pathImagen = path.resolve(__dirname, `../uploads/${type}/${nameImg}`);
        
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
}

export const getImage = async(req: Request, res: Response) => {
    let type = req.params.type;
    let img = req.params.img;
    
    let pathImg = path.join(__dirname, `../uploads/${type}/${img}`);
    if (fs.existsSync( pathImg )) {
        res.sendFile( pathImg )
    } else {
        let pathNoImg = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile( pathNoImg );
    }

}