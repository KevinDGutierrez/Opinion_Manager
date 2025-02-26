<<<<<<< HEAD
import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {
        
        const payload = { uid };
        
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                err ? (console.log(err), reject('No se pudo generar el token')) : resolve(token);
            });
    });
}
=======
import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        })
    }

    next();
};
>>>>>>> feature/publication
