import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// Estender o Request do Express para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
      return;
    }

    // Formato: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }

    // Validar token
    const decoded = verifyToken(token);

    // Adicionar dados do usuário na requisição
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next(); // Continua para o controller
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};