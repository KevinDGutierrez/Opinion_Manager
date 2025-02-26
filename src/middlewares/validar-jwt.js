import { response, request } from "express";
import Publication from './publication.model.js';
import Categorie from '../categories/categories.model.js';
import User from '../users/user.model.js';
import Comment from '../comments/comment.model.js'

export const addPublication = async (req, res) =>{
    try {
        const {name, ...data} = req.body;
        const lowername = name ? name.toLowerCase() : null;
        const user = await User.findOne({username: data.username.toLowerCase()});
        const categorie = await Categorie.findOne({
                    $or: [{ name: lowername }] 
                });

        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }
        
        if(!categorie){
            return res.status(404).json({
                success: false,
                msg: 'Categoría no encontrada'
            })
        }

        const publication = await Publication.create({
            ...data,
            user: user._id,
            username: user.username,
            categorie: categorie._id,
            name: categorie.name.toLowerCase()

        })

        const pubDetails = await Publication.findById(publication._id)
            .populate('user','username')
            .populate('categorie', 'name');
        
        const details ={
            details:{
                pubDetails
            }
        }
        return res.status(201).json({
            msg: 'Publicación agregada correctamente',
            publication,
            details
        });
        
    } catch (error) {
       console.log(error);
       return res.status(500).json({
        msg: "Publication registration failed",
        error
    }); 
    }
};

export const updatePublication = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, username, ...data } = req.body;
        let { name } = req.body;

        if (name) {
            name = name.toLowerCase();
            data.name = name;
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(400).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        const categorie = await Categorie.findOne({ name });
        if (!categorie) {
            return res.status(400).json({
                success: false,
                msg: "Categoría no encontrada"
            });
        }

        data.categorie = categorie._id;

        
        if (req.user.id !== publication.user.toString()) {
            return res.status(400).json({
                success: false,
                msg: 'No tienes permisos para editar esta publicación'
            });
        }

        if (publication.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Esta publication ha sido eliminada'
            });
        }

    
        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true });

        const pubDetails = await Publication.findById(updatedPublication._id)
            .populate('user', 'username')
            .populate('categorie', 'name');

        const details = {
            details: {
                pubDetails
            }
        };

        return res.status(200).json({
            success: true,
            msg: "Publicación actualizada con éxito",
            details
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Publication update failed",
            error
        });
    }
};




export const deletePublication = async (req, res = response) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id);
        
        if (!publication) {
            return res.status(400).json({
                success: false,
                msg: "Publicación no encontrada"
            });
        }

        
        if (req.user.id !== publication.user.toString()) {
            return res.status(400).json({
                success: false,
                msg: 'No tienes permisos para eliminar esta publicación'
            });
        }

    
        const updatedPublication = await Publication.findByIdAndUpdate(id, { estado: false }, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'Publicación desactivada',
            publication: updatedPublication
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Publication deletion failed",
            error
        });
    }
};

export const getPublication = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .populate('user', 'username')
                .populate('categorie', 'name')
                .skip(parseInt(desde))
                .limit(parseInt(limite))
        ]);

        
        const publicationsWithComments = await Promise.all(
            publications.map(async (publication) => {
                const comments = await Comment.find({ publication: publication._id, estado: true })
                    .select('content')
                    .populate('user', 'username'); 
                
                const formattedComments = comments.map(comment => ({
                    username: comment.user.username,
                    content: comment.content
                }));

                return {
                    ...publication.toObject(),
                    comments: formattedComments 
                };
            })
        );

        res.status(200).json({
            success: true,
            total,
            publications: publicationsWithComments
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Publication retrieval failed",
            error
        });
    }
};


