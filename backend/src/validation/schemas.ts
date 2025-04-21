import * as yup from 'yup';

export const productQuerySchema = yup.object({
  query: yup.object({
    categories: yup.array().of(yup.string()),
    minPrice: yup.number().min(0),
    maxPrice: yup.number().min(0),
    sort: yup.string().oneOf(['latest', 'price-asc', 'price-desc']),
    page: yup.number().min(1),
    limit: yup.number().min(1).max(50),
    search: yup.string()
  })
});

export const cartAddSchema = yup.object({
  body: yup.object({
    productId: yup.number().required(),
    quantity: yup.number().required().min(1)
  })
});

export const reviewSchema = yup.object({
  body: yup.object({
    rating: yup.number().required().min(1).max(5),
    comment: yup.string().required().min(10).max(500),
    productId: yup.number().required()
  })
});

export const productSchema = yup.object({
  query: yup.object({
    categories: yup.array().of(yup.string()),
    minPrice: yup.number().min(0),
    maxPrice: yup.number().min(0),
    sort: yup.string().oneOf(['latest', 'price-asc', 'price-desc']),
    page: yup.number().min(1),
    limit: yup.number().min(1).max(50),
    search: yup.string()
  })
});

export const signupSchema = yup.object({
  body: yup.object({
    email: yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .trim(),
    password: yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  }).required()
}).required();
