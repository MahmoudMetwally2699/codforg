export interface Product {
  _id?: string | number;
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: Review[];
  reviewCount: number;
  averageRating: number;
  isWishlisted?: boolean;
  productId?: number;
}

export interface Review {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sort: 'latest' | 'price-asc' | 'price-desc';
  page: number;
  search: string;
}

export interface PaginationMetadata {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMetadata;
  error?: string;
}

export interface SearchParams {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: 'latest' | 'price-asc' | 'price-desc';
  page?: number;
  limit?: number;
  search?: string;
}
