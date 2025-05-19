import { response, request } from "express";
import Course from "./courses.model.js"

export const createCourses = async () => {
    try {
        const name = "Matemáticas";
        const description = "Ciencias exactas";

        const course = await Course.findOne({ name, description });

        if (!course) {
            const newCourse = new Course({ name, description });
            await newCourse.save();
            console.log('Curso Matemáticas creado exitosamente');
        } else {
            console.log('Curso Matemáticas ya existe');
        }
    } catch (error) {
        console.error('No se pudo crear el curso', error);
    }
};

export const createCourses2 = async () => {
    try {
        const name = "Lengua";
        const description = "Enseñar y mejorar el idioma";

        const course = await Course.findOne({ name, description });

        if (!course) {
            const newCourse = new Course({ name, description });
            await newCourse.save();
            console.log('Curso Lengua creado exitosamente');
        } else {
            console.log('Curso Lengua ya existe');
        }
    } catch (error) {
        console.error('No se pudo crear el curso', error);
    }
};

export const createCourses3 = async () => {
    try {
        const name = "Sociales";
        const description = "Área de la ciudadanía";

        const course = await Course.findOne({ name, description });

        if (!course) {
            const newCourse = new Course({ name, description });
            await newCourse.save();
            console.log('Curso Sociales creado exitosamente');
        } else {
            console.log('Curso Sociales ya existe');
        }
    } catch (error) {
        console.error('No se pudo crear el curso', error);
    }
};


export const getCourses = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.body;
        const query = { status: true };

        const [total, courses] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
                .skip(parseInt(desde))
                .limit(parseInt(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            courses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Course retrieval failed",
            error
        });
    }
};
