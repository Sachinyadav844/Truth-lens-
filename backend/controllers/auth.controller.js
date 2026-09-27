<<<<<<< HEAD
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
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    const jwtSecret = getJwtSecret();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
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
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
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
=======
import crypto from 'crypto'
import { sessions, users } from '../utils/store.js'

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex')
}

function buildAuthResponse(user) {
  const token = `truthlens_${crypto.randomBytes(18).toString('hex')}`
  sessions.set(token, user.email)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

export async function login(request, response) {
  try {
    const { email, password } = request.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return response.status(400).json({ message: 'Email and password are required.' })
    }

    const user = users.get(normalizedEmail)
    if (!user || user.password !== hashPassword(password)) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    return response.json(buildAuthResponse(user))
  } catch (error) {
    return response.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}

export async function signup(request, response) {
  try {
    const { name, email, password } = request.body || {}
    const normalizedName = String(name || '').trim()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password) {
      return response.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (users.has(normalizedEmail)) {
      return response.status(409).json({ message: 'An account with this email already exists.' })
    }

    if (String(password).length < 8) {
      return response.status(400).json({ message: 'Password must be at least 8 characters long.' })
    }

    const user = {
      id: crypto.randomUUID(),
      name: normalizedName,
      email: normalizedEmail,
      password: hashPassword(password),
    }

    users.set(normalizedEmail, user)
    return response.status(201).json(buildAuthResponse(user))
  } catch (error) {
    return response.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}
>>>>>>> 209e3c227fe7b81c98e09fcb867039ca249750c9
