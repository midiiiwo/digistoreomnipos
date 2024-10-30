import { useQuery } from 'react-query';
import { getCategoryProducts } from '../api/sales';

export function useGetCategoryProducts(merchant, outlet, category, enabled) {
  const queryResult = useQuery(
    ['outlet-products', merchant, outlet, category],
    () => getCategoryProducts(merchant, outlet, category),
    { enabled },
  );
  return queryResult;
}
