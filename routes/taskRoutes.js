import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import taskModel from '../model/taskModel.js';

const router = express.Router();

// ดึงรายการงานของผู้ใช้
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await taskModel.find({ userId: req.userId });
    console.log(req.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// เพิ่มงานใหม่
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const newTask = new taskModel({
      userId: req.userId,
      name,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// อัพเดทงาน
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, completed } = req.body; // ✅ รับค่าที่ต้องการอัปเดต

    const updateData = {};
    if (name) updateData.name = name; // ✅ ถ้ามี name ให้ใส่
    if (typeof completed === 'boolean') updateData.completed = completed; // ✅ ถ้ามี completed ให้ใส่

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ลบงาน
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await taskModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
