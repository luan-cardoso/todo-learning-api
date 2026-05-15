import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import taskRoutes from "./routes/tasksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { apiKeyMiddleware } from "./middlewares/apiKeyMiddleware.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  }),
);
app.use(express.json());
app.use(apiKeyMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
