<<<<<<< HEAD
import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("surname", "The surname is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isString().withMessage("Enter a valid username"),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];
=======
import { Schema, model } from "mongoose";

const publicationSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titulo:{
        type: String,
        required: true,
        lowercase: true
    },
    categorie:{
        type: Schema.Types.ObjectId,
        ref: "Categorie",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    comment:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    estado:{
        type: Boolean,
        default: true
    }

    },
    {
        timestamps: true,
        versionKey: false   
    }
);


export default model("Publication", publicationSchema);
>>>>>>> feature/publication
