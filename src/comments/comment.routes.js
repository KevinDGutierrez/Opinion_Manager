import { Router }  from 'express';
import { check  } from 'express-validator';
import { addComment, updateComment, deleteComment} from './comment.controller.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeCommentById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/addComment',
    validarCampos,
    addComment
);

router.put(
    '/:id',
    [
        check('id').custom(existeCommentById),
        validarCampos
    ],
    updateComment
);

router.delete(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCommentById),
    ],
    deleteComment
)

export default router;