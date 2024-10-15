import { useQuery } from 'react-query';
import { getSelectedProductDetails } from '../api/products';

export function useGetSelectedProductDetails(merchant, outlet, product) {
  const queryResult = useQuery(
    ['selected-product-details', product, merchant, outlet],
    () => getSelectedProductDetails(merchant, outlet, product),
  );
  return queryResult;
}
