import { response, request } from "express";
import Categorie from './categories.model.js'
import Publication from "../publications/publication.model.js";
import Comment from "../comments/comment.model.js";

export const addCategory = async (req, res) => {
    try {
        
        const data = req.body;
        const categories = await Categorie.create({
            name: data.name.toLowerCase()
        })

        if(req.user.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'No tiene permisos para agregar categorías'
            });
        }

        return res.status(200).json({
            message: "categorie add",
            categories: categories
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar categoría'
        });
    }
};

export const updateCategory = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const categorie = await Categorie.findById(id);
        if (!categorie) {
            return res.status(404).json({
                success: false,
                msg: 'Categoría no encontrada'
            });
        }

        if (req.user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                msg: 'No tiene permisos para modificar categorías'
            });
        }

        if (categorie.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Esta categoria ha sido eliminada'
            });
        }

        const updatedCategory = await Categorie.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            success: true,
            msg: 'Categoría actualizada correctamente',
            category: updatedCategory
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar categoría',
            error
        });
    }
};


export const deleteCategory = async (req, res = response) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "No tiene permisos para desactivar categorías",
            });
        }

        // Verificar si la categoría existe
        const category = await Categorie.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Categoría no encontrada",
            });
        }

        // Buscar todas las publicaciones asociadas a la categoría
        const publications = await Publication.find({ categorie: id });

        // Obtener los IDs de las publicaciones
        const publicationIds = publications.map((pub) => pub._id);

        // Desactivar todos los comentarios de las publicaciones
        await Comment.updateMany(
            { publication: { $in: publicationIds } },
            { $set: { estado: false } }
        );

        // Desactivar todas las publicaciones de la categoría
        await Publication.updateMany(
            { categorie: id },
            { $set: { estado: false } }
        );

        // Desactivar la categoría
        await Categorie.findByIdAndUpdate(id, { estado: false });

        return res.status(200).json({
            success: true,
            msg: "Categoría, publicaciones y comentarios desactivados correctamente",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Error al desactivar la categoría",
            error,
        });
    }
};


export const createCategory = async () => {
    try {
        const categorie = await Categorie.findOne({name: "Universal".toLowerCase()})  

        if(!categorie){
            const newCategorie = new Categorie({
                name: "Universal"
            })
            await newCategorie.save();
            console.log('Categoría Universal creada exitosamente');
        }else {
            console.log('Categoría Universal ya existe');
        }
    } catch (error) {
        console.error('No se pudo crear la categoria',error);
    }
}