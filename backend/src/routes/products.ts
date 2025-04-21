import { Router } from 'express';
import { validate } from '../middleware/validation';
import { productQuerySchema } from '../validation/schemas';
import { Product } from '../data/products';

const router = Router();

router.get('/', validate(productQuerySchema), async (req, res) => {
  const { categories, minPrice, maxPrice, sort, page = 1, limit = 9, search } = req.query;
  const db = req.app.locals.db;

  const query: any = {};
  if (categories) {
    query.category = { $in: Array.isArray(categories) ? categories : [categories] };
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions: any = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'latest': { _id: -1 }
  };

  try {
    const [total, products] = await Promise.all([
      db.collection('products').countDocuments(query),
      db.collection('products')
        .aggregate([
          { $match: query },
          {
            $lookup: {
              from: 'reviews',
              localField: '_id',
              foreignField: 'productId',
              as: 'reviews'
            }
          },
          {
            $addFields: {
              id: "$productId",
              reviewCount: { $size: { $ifNull: ["$reviews", []] } },
              averageRating: { $ifNull: ["$rating", 4.5] }
            }
          },
          { $sort: sortOptions[sort as string] || sortOptions.latest },
          { $skip: (Number(page) - 1) * Number(limit) },
          { $limit: Number(limit) }
        ]).toArray()
    ]);

    const formattedProducts = products.map((product: any) => ({
      ...product,
      id: product.productId || product.id
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        total,
        currentPage: Number(page),
        perPage: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const product = await db.collection('products').findOne({ _id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export const productsRouter = router;
