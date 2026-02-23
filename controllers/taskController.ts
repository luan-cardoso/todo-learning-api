import type { Request, Response } from "express";
import { getDatabase } from "../config/database.js";
import { ObjectId } from 'mongodb';
import type { Task, CreateTaskDTO } from "../types/tasks.js";

const COLLECTION_NAME = 'tasks';

interface TaskParams {
    id: string;
}

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const db = getDatabase();
        const tasks = await db
            .collection<Task>(COLLECTION_NAME)
            .find()
            .sort({ createdAt: -1 }) // Mais recentes primeiro
            .toArray();

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar tasks',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, subject, priority }: CreateTaskDTO = req.body;

        const db = getDatabase();

        const newTask: Omit<Task, '_id'> = {
            title,
            description: description || '',
            subject,
            completed: false,
            priority: priority || 'medium',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection<Task>(COLLECTION_NAME).insertOne(newTask as Task);

        const createdTask = await db
            .collection<Task>(COLLECTION_NAME)
            .findOne({ _id: result.insertedId });

        res.status(201).json({
            success: true,
            message: 'Task criada com sucesso',
            data: createdTask
        });
    } catch (error) {
        console.error('Erro ao criar task:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar task',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const updateTask = async (req: Request<TaskParams>, res: Response) => {
    try {
        const { id } = req.params;

        // Validar se o ID é válido
        if (!ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
            return;
        }

        const { title, description, subject, completed, priority } = req.body;
        const db = getDatabase();

        const updateData: Partial<Task> = {
            updatedAt: new Date()
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (subject !== undefined) updateData.subject = subject;
        if (completed !== undefined) updateData.completed = completed;
        if (priority !== undefined) updateData.priority = priority;

        const result = await db
            .collection<Task>(COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Task não encontrada'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Task atualizada com sucesso',
            data: result
        });
    } catch (error) {
        console.error('Erro ao atualizar task:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar task',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const deleteTask = async (req: Request<TaskParams>, res: Response) => {
    try {
        const { id } = req.params;
    
        // Validar se o ID é válido
        if (!ObjectId.isValid(id)) {
          res.status(400).json({
            success: false,
            message: 'ID inválido'
          });
          return;
        }
    
        const db = getDatabase();
    
        // Deletar a task
        const result = await db
          .collection<Task>(COLLECTION_NAME)
          .deleteOne({ _id: new ObjectId(id) });
    
        // Se não encontrou/deletou nenhuma task
        if (result.deletedCount === 0) {
          res.status(404).json({
            success: false,
            message: 'Task não encontrada'
          });
          return;
        }
    
        res.status(200).json({
          success: true,
          message: 'Task deletada com sucesso'
        });
      } catch (error) {
        console.error('Erro ao deletar task:', error);
        res.status(500).json({
          success: false,
          message: 'Erro ao deletar task',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
}