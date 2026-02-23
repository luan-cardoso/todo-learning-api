import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../config/database.js';
import type { User, RegisterDTO, LoginDTO } from '../types/user.js';
import { generateToken } from '../utils/jwt.js';

const COLLECTION_NAME = 'users';

// REGISTRO
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password }: RegisterDTO = req.body;

        // Validar campos
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
            return;
        }

        const db = getDatabase();

        // Verificar se email já existe
        const existingUser = await db
            .collection<User>(COLLECTION_NAME)
            .findOne({ email });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Email já cadastrado'
            });
            return;
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const newUser: Omit<User, '_id'> = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await db
            .collection<User>(COLLECTION_NAME)
            .insertOne(newUser as User);

        // Gerar token
        const token = generateToken({
            userId: result.insertedId.toString(),
            email
        });

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
                userId: result.insertedId,
                name,
                email,
                token
            }
        });
    } catch (error) {
        console.error('Erro ao registrar:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário'
        });
    }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginDTO = req.body;

        // Validar campos
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
            return;
        }

        const db = getDatabase();

        // Buscar usuário
        const user = await db
            .collection<User>(COLLECTION_NAME)
            .findOne({ email });

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
            return;
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
            return;
        }

        // Gerar token
        const token = generateToken({
            userId: user._id!.toString(),
            email: user.email
        });

        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login'
        });
    }
};