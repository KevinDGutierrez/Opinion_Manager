import { response, request } from "express";
import Comment from './comment.model.js';
import User from '../users/user.model.js';
import Publication from '../publications/publication.model.js';

export const addComment = async (req, res) => {
  try {
    const { publicationId, username, content } = req.body;

    // Buscar usuario por username (en minúsculas)
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "Usuario no encontrado",
      });
    }

    // Buscar publicación por ID
    const publication = await Publication.findById(publicationId);
    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publicación no encontrada",
      });
    }

    // Crear el comentario
    const comment = await Comment.create({
      user: user._id,
      content,
      publication: publication._id,
    });

    // Poblar datos para respuesta
    const comDetails = await Comment.findById(comment._id)
      .populate("user", "username")
      .populate("publication", "titulo");

    return res.status(201).json({
      msg: "Comentario agregado correctamente",
      comment: comDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Fallo al crear comentario",
      error,
    });
  }
};


export const updateComment = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, username, ...data } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(400).json({
                success: false,
                msg: "Comment no encontrado"
            });
        }

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (req.user.id !== comment.user.toString()) {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permisos para editar este comment'
            });
        }

        if (comment.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Este comentario ha sido eliminado'
            });
        }

        
        const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true });

        const comDetails = await Comment.findById(updatedComment._id)
            .populate('user', 'username')
            .populate('publication', 'titulo');

        return res.status(200).json({
            success: true,
            msg: "Comment actualizado con éxito",
            comment: {
                username: comDetails.user.username,
                content: comDetails.content
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Comment update failed",
            error
        });
    }
};


export const deleteComment = async (req, res = response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(400).json({
        success: false,
        msg: "Comment no encontrado"
      });
    }

    // Eliminamos el chequeo de permisos porque no tienes req.user

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Comment desactivado",
      comment: updatedComment
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Comment delete failed",
      error
    });
  }
};
