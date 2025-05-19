import { response, request } from "express";
import Publication from './publication.model.js';
import Course from '../courses/courses.model.js';
import User from '../users/user.model.js';
import Comment from '../comments/comment.model.js';

const validCourses = ['matemáticas', 'lengua', 'sociales'];

export const addPublication = async (req, res) => {
    try {
        const { name, ...data } = req.body;
        const lowername = name ? name.toLowerCase() : null;

        if (!validCourses.includes(lowername)) {
            return res.status(400).json({
                success: false,
                msg: 'Curso inválido. Debe ser uno de: Matemáticas, Lengua, Sociales'
            });
        }

        const user = await User.findOne({ username: data.username.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        const course = await Course.findOne({ name: new RegExp(`^${lowername}$`, 'i') });
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado'
            });
        }

        const publication = await Publication.create({
            ...data,
            user: user._id,
            username: user.username,
            course: course._id
        });

        const pubDetails = await Publication.findById(publication._id)
            .populate('user', 'username')
            .populate('course', 'name');

        return res.status(201).json({
            msg: 'Publicación agregada correctamente',
            publication,
            details: { pubDetails }
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
        const { _id, username, name, ...data } = req.body;
        let lowername = name ? name.toLowerCase() : null;

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

        if (lowername && !validCourses.includes(lowername)) {
            return res.status(400).json({
                success: false,
                msg: "Curso inválido. Debe ser uno de: Matemáticas, Lengua, Sociales"
            });
        }

        if (lowername) {
            const course = await Course.findOne({ name: new RegExp(`^${lowername}$`, 'i') });
            if (!course) {
                return res.status(400).json({
                    success: false,
                    msg: "Curso no encontrado"
                });
            }
            data.course = course._id;
        }

        if (req.user.id !== publication.user.toString()) {
            return res.status(400).json({
                success: false,
                msg: 'No tienes permisos para editar esta publicación'
            });
        }

        if (publication.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Esta publicación ha sido eliminada'
            });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true });

        const pubDetails = await Publication.findById(updatedPublication._id)
            .populate('user', 'username')
            .populate('course', 'name');

        return res.status(200).json({
            success: true,
            msg: "Publicación actualizada con éxito",
            details: { pubDetails }
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
        .populate('course', 'name')
        .skip(parseInt(desde))
        .limit(parseInt(limite))
    ]);

    const publicationsWithComments = await Promise.all(
      publications.map(async (publication) => {
        const comments = await Comment.find({ publication: publication._id, estado: true })
          .select('content createdAt user')
          .populate('user', 'username');

        const formattedComments = comments.map(comment => ({
          _id: comment._id, // ✅ Incluimos el _id para que funcione el botón Eliminar
          username: comment.user?.username || "Anónimo",
          content: comment.content,
          createdAt: comment.createdAt
        }));

        const pubObj = publication.toObject();

        return {
          _id: pubObj._id,
          titulo: pubObj.titulo,
          content: pubObj.content,
          createdAt: pubObj.createdAt,
          user: pubObj.user,
          course: pubObj.course,
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

  