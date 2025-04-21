import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { cartAddSchema } from '../validation/schemas';
import { CartItem } from '../types/Cart';
import { AppDb } from '../types/db';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const userId = req.user?.email;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const db = req.app.locals.db as AppDb;

  try {
    const cart = await db.collection('carts')
      .aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: 'id',
            as: 'product'
          }
        },
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray() as CartItem[];

    res.json(cart.filter(item => item.product != null));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add', auth, validate(cartAddSchema), async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.email;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const db = req.app.locals.db as AppDb;

  try {
    await db.collection('carts').updateOne(
      { userId, productId },
      {
        $setOnInsert: { userId, productId },
        $inc: { quantity }
      },
      { upsert: true }
    );

    // Fetch updated cart with product details
    const cart = await db.collection('carts')
      .aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: 'productId', // Changed from 'id' to 'productId'
            as: 'product'
          }
        },
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray();

    const formattedCart = cart.map(item => ({
      ...item,
      id: item._id,
      product: {
        ...item.product,
        id: item.product.productId
      }
    }));

    req.app.get('io').emit('cartUpdated', { userId, cart: formattedCart });
    res.json(formattedCart);
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/remove/:productId', auth, async (req: Request, res: Response) => {
  const userId = req.user?.email;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const productId = parseInt(req.params.productId);
  const db = req.app.locals.db as AppDb;

  try {
    await db.collection('carts').deleteOne({ userId, productId });

    const cart = await db.collection('carts')
      .find({ userId })
      .toArray();

    req.app.get('io').emit('cartUpdated', { userId, cart });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

export const cartRouter = router;
