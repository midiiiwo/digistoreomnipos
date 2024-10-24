import { useQuery } from 'react-query';
import { getProductMappedOutlets } from '../api/products';

export function useGetProductMappedOutlets(merchant, product) {
  const queryResult = useQuery(['product-outlets', merchant, product], () =>
    getProductMappedOutlets(merchant, product),
  );
  return queryResult;
}
