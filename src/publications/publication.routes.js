import { Router }  from 'express';
import { check  } from 'express-validator';
import { addPublication, updatePublication, deletePublication, getPublication } from './publication.controller.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existePublicationById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/addPublication',
    
    validarCampos,
    addPublication
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existePublicationById),
        validarCampos
    ],
    updatePublication
);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existePublicationById),
    ],
    deletePublication
);

router.get(
    '/',
    getPublication
);

export default router;