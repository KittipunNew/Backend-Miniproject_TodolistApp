import express from 'express';
import connectDB from './config/mongodb.js';
import morgan from 'morgan';
import cors from 'cors';
import {
  addTask,
  taskList,
  updateTask,
  deleteTask,
} from './controller/taskController.js';
import dotenv from 'dotenv';

dotenv.config();
// ตั้งค่า Express App
const app = express();
const PORT = 3000;

// Servive connections
connectDB();

// Middleware
app.use(morgan('dev')); // Log request ที่เข้ามายังเซิร์ฟเวอร์
app.use(express.json()); // ให้ Express จัดการ JSON request body

const allowedOrigins = ['https://miniproject-todolist-app.vercel.app/'];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS')); // Block the origin
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies or Authorization headers
  })
);

app.get('/', taskList);
app.post('/', addTask);
app.put('/', updateTask);
app.delete('/', deleteTask);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}🚀`));
