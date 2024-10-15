import { useQuery } from 'react-query';
import { getOutletCategories } from '../api/sales';

export function useGetOutletCategories(merchant, outlet) {
  const queryResult = useQuery(['product-categories', merchant, outlet], () =>
    getOutletCategories(merchant, outlet),
  );
  return queryResult;
}
