import { useQuery } from 'react-query';
import { getSelectedCategoryDetails } from '../api/products';

export function useGetSelectedCategoryDetails(category) {
  const queryResult = useQuery(['selected-product-details', category], () =>
    getSelectedCategoryDetails(category),
  );
  return queryResult;
}
