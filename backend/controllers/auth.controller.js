import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
};

export const signup = async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password;
    
    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: true, message: 'Enter a valid email and a password between 8 and 128 characters' });
    }

    const jwtSecret = getJwtSecret();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: true, message: 'User already exists' });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password;

    if (!email || typeof password !== 'string') {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: true, message: 'Enter a valid email address' });
    }

    const jwtSecret = getJwtSecret();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
    return res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};
