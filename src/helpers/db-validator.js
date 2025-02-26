import User from '../users/user.model.js';
import Categorie from '../categories/categories.model.js';
import Publication from '../publications/publication.model.js';
import Comment from '../comments/comment.model.js'

export const existenteEmail = async (email = ' ') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeCategoryById = async (id = '') => {
    const existeCategory = await Categorie.findById(id);

    if (!existeCategory) {
        throw new Error(`La categoría con ID ${ id } no existe`);
    }
}

export const existePublicationById = async (id = '') =>{
    const existePublication = await Publication.findById(id);

    if(!existePublication){
        throw new Error(`La publicación con ID ${id} no existe`);
    }
}

export const existeCommentById = async (id = '') =>{
    const existeComment = await Comment.findById(id);

    if(!existeComment){
        throw new Error(`El comentario con ID ${id} no existe`);
    }
} 