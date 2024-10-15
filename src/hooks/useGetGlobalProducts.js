import { useQuery } from 'react-query';
import { getGlobalProducts } from '../api/products';

export function useGetGlobalProducts(merchant, outlet) {
  const queryResult = useQuery(['global-products', merchant, outlet], () =>
    getGlobalProducts(merchant, outlet),
  );
  return queryResult;
}
