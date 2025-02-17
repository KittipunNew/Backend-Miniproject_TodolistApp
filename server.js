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

// Configure CORS
app.use(cors());

app.get('/', taskList);
app.post('/', addTask);
app.put('/', updateTask);
app.delete('/', deleteTask);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}🚀`));
