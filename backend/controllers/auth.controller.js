import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Email and password are required" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
    res.status(501).json({ error: "Login not implemented yet" });
};