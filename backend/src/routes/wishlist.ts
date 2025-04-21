import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { User } from '../types/User';

const router = Router();

router.post('/:productId', auth, async (req: Request, res: Response) => {
  const { productId } = req.params;
  const userId = req.user!.email;  // We can use ! here as auth middleware ensures user exists
  const db = req.app.locals.db;

  try {
    const result = await db.collection('wishlists').updateOne(
      { userId, productId: Number(productId) },
      { $setOnInsert: { userId, productId: Number(productId), addedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, operation: result.upsertedCount ? 'added' : 'already exists' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

export const wishlistRouter = router;
