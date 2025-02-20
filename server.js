import express from 'express';
import connectDB from './config/mongodb.js';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
// ตั้งค่า Express App
const app = express();
const PORT = 3001;

// Servive connections
connectDB();

// Middleware
app.use(morgan('dev')); // Log request ที่เข้ามายังเซิร์ฟเวอร์
app.use(express.json()); // ให้ Express จัดการ JSON request body

// Configure CORS
app.use(
  cors({
    origin: [
      'https://frontend-miniproject-todolist-app.vercel.app',
      'http://localhost:5173',
      'http://localhost:5175',
    ],
  })
);

app.use('/', authRoutes);
app.use('/', taskRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}🚀`));
