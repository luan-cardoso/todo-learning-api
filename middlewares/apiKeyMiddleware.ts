import type { Request, Response, NextFunction } from 'express';

const validApiKeys = [
  process.env.API_KEY
].filter(Boolean); // Remove undefined

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Pegar API Key do header
    const apiKey = req.headers['x-api-key'] as string;

    // Verificar se foi enviada
    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: 'API Key não fornecida'
      });
      return;
    }

    // Verificar se é válida
    if (!validApiKeys.includes(apiKey)) {
      res.status(401).json({
        success: false,
        message: 'API Key inválida'
      });
      return;
    }

    // API Key válida → continua
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Erro ao validar API Key'
    });
  }
};