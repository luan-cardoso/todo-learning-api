import { Router } from "express";
import * as taskController from '../controllers/taskController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/tasks', taskController.getAllTasks);
//router.get('/tasks/:id', taskController.getTasksById);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

export default router;