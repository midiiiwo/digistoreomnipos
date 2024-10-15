import { useQuery } from 'react-query';
import { getAllProductsCategories } from '../api/products';

export function useGetAllProductsCategories(merchant) {
  const queryResult = useQuery(['product-categories', merchant], () =>
    getAllProductsCategories(merchant),
  );
  return queryResult;
}
