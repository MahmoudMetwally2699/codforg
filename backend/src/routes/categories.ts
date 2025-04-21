import { Router } from 'express';

const router = Router();

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports'
];

router.get('/', (req, res) => {
  res.json(categories);
});

export const categoriesRouter = router;
