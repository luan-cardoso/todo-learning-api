import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { connectDatabase } from './config/database.js';
import taskRoutes from './routes/tasksRoutes.js'
import authRoutes from './routes/authRoutes.js';

const app = express()
const port = 3000

//Middleware 
app.use(express.json());

// públicas 
app.use('/api/auth', authRoutes);

// protegidas
app.use('/api', taskRoutes);

// Inicializar servidor
const startServer = async () => {
    try {
      // Conectar ao MongoDB primeiro
      await connectDatabase();
      
      app.listen(port, () => {
        console.log(`Server rodando na porta ${port}`);
      });
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      process.exit(1);
    }
  };
  
startServer();