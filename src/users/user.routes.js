import { Router }  from 'express';
import { check  } from 'express-validator';
import { login, register, updateUser } from './user.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeUsuarioById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);  

router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    register
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

export default router;