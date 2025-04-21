import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate } from '../middleware/validation';
import { signupSchema } from '../validation/schemas';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req: Request, res: Response) => {
  console.log('Login request received:', { email: req.body.email });

  const { email, password } = req.body;
  const db = req.app.locals.db;

  if (!email || !password) {
    console.log('Missing credentials');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Found user:', { email: user.email, hasPassword: !!user.password });

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email, id: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful, token generated for:', email);
    res.json({ token, user: { email, id: user._id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/signup', validate(signupSchema), async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const db = req.app.locals.db;

  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = jwt.sign({ email, id: result.insertedId }, JWT_SECRET);
    res.status(201).json({ token, user: { email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export const authRouter = router;
