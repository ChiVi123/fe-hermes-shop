import { apiRequest } from '~/lib/requests';

type Product = {
  _id: string;
  name: string;
  slugify: string;
  shortDescription: string;
  attrs: { key: string; value: string }[];
  gender: 'men' | 'women';
  rating: number;
  variant: { price: number; discountPrice: number; color: string };
};

export const getProductsFromServer = () => {
  return apiRequest
    .get('/api/v1/products', {
      headers: { overwrite: 'header-value-2' },
      query: { limit: 12, sort: '-createdAt' },
    })
    .fetchError(() => [])
    .json<Product[]>();
};
