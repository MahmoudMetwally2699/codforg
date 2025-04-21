import { Product } from '../data/products';

export interface CartItem {
  _id?: string;
  userId: string;
  productId: number;
  quantity: number;
  product?: Product;
}
