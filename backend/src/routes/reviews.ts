import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { reviewSchema } from '../validation/schemas';
import { ObjectId } from 'mongodb';

const router = Router();

router.post('/', auth, validate(reviewSchema), async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { productId, rating, comment } = req.body;
  const userId = req.user.email;
  const db = req.app.locals.db;

  try {
    const review = {
      userId,
      productId: Number(productId),
      rating,
      comment,
      createdAt: new Date()
    };

    await db.collection('reviews').insertOne(review);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export const reviewsRouter = router;
