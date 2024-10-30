import { useQuery } from 'react-query';
import { getSelectedProductDetails } from '../api/products';

export function useGetSelectedProductDetails(merchant, outlet, product) {
  const queryResult = useQuery(
    ['selected-product-details', merchant, outlet, product],
    () => getSelectedProductDetails(merchant, outlet, product),
  );
  return queryResult;
}
