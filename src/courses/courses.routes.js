import { Router } from 'express';
import { getCourses } from "./courses.controller.js";

const router = Router();

router.get(
    '/',
    getCourses
);

export default router;