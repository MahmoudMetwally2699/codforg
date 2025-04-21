export const products = [
  {
    id: 1,
    title: "MacBook Pro M2",
    price: 1299.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/laptop/400/300",
    rating: 4.8
  },
  {
    id: 2,
    title: "Nike Air Max",
    price: 129.99,
    category: "Sports",
    image: "https://picsum.photos/seed/shoes/400/300",
    rating: 4.5
  },
  {
    id: 3,
    title: "Premium Coffee Maker",
    price: 79.99,
    category: "Home & Kitchen",
    image: "https://picsum.photos/seed/coffee/400/300",
    rating: 4.3
  },
  {
    id: 4,
    title: "Wireless Earbuds",
    price: 149.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/earbuds/400/300",
    rating: 4.6
  },
  {
    id: 5,
    title: "Yoga Mat Premium",
    price: 29.99,
    category: "Sports",
    image: "https://picsum.photos/seed/yoga/400/300",
    rating: 4.4
  },
  {
    id: 6,
    title: "Smart Watch Pro",
    price: 199.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/watch/400/300",
    rating: 4.7
  },
  {
    id: 7,
    title: "Kitchen Blender",
    price: 69.99,
    category: "Home & Kitchen",
    image: "https://picsum.photos/seed/blender/400/300",
    rating: 4.2
  },
  {
    id: 8,
    title: "Running Track Pants",
    price: 49.99,
    category: "Sports",
    image: "https://picsum.photos/seed/pants/400/300",
    rating: 4.3
  },
  {
    id: 9,
    title: "4K Smart TV",
    price: 699.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/tv/400/300",
    rating: 4.9
  }
];

export type Product = typeof products[0];
