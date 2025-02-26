<<<<<<< HEAD
import fs from 'fs/promises';
import { join } from 'path';

export const deleteFileOnError = async (err, req, res, next) => {
    if(req.file && req.filePath) {
        const filePath = join(req.filePath, req.file.fileName);
        try {
            await fs.unlink(filePath);
        } catch (unlinkErr) {
            console.log('Error delete file: ', unlinkErr);
        }
    }
    if(err.status === 400 || err.errors) {
        return res.status(400).json({
            success: false,
            errors: err.errors
        });
    }
    return res.status(500).json({
        susccess: false,
        message: err.message
    });
}
=======
import jwt from 'jsonwebtoken';

import User from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Usuario no existe en la base de datos'
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Token no válido - usuarios con estado: false'
            });
        }
        
        req.user = user;
        
        next();
    
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no válido"
        });
    }
};
>>>>>>> feature/publication
