import { ObjectId } from 'mongodb';

export interface Task {
  _id?: ObjectId;
  title: string;
  description?: string;
  subject: string; // tema de estudo (ex: "JavaScript", "Banco de Dados")
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  subject: string;
  priority?: 'low' | 'medium' | 'high';
}