import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from './prismaClient.js';

dotenv.config();

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user and return a JWT
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the incoming password
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    // Create user record
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    // Create a default todo for new users
    await prisma.todo.create({
      data: {
        task: 'Welcome! Add your first todo.',
        userId: user.id
      }
    });

    // Generate JWT token valid for 24 hours
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.sendStatus(503);
  }
});

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and return a JWT
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Issue JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.sendStatus(503);
  }
});

export default router;

