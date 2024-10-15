import { useQuery } from 'react-query';
import { getTaxById } from '../api/merchant';

export function useGetTaxById(id) {
  const queryResult = useQuery(['merchant-taxes', id], () => getTaxById(id));
  return queryResult;
}
