import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from './../model/userModel.js';

const router = express.Router();

// สมัครสมาชิก
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    //ตรวจสอบว่ามีemailอยู่ไหม
    if (existingUser)
      return res.status(400).json({ message: 'อีเมล์ถูกใช้แล้ว' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // นำพาสเวิร์ดที่กรอกมาไปเข้ารหัส
    const newUser = new userModel({ name, email, password: hashedPassword });

    //บันทึกผู้ใช้
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ล็อกอิน
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    // ตรวจสอบว่าอีเมลที่ใส่มาถูกต้องไหม
    if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้' });

    // เก็บค่าตัวแปรตรวจรหัสผ่านที่ใส่มาว่าตรงกันไหม
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
