import { useQuery } from 'react-query';
import { getAllOrders } from '../api/orders';

export function useGetAllOrders(startDate, endDate, merchant, enabled = false) {
  const queryResult = useQuery(
    ['all-orders', merchant],
    () => getAllOrders(startDate, endDate, merchant),
    { staleTime: 0, enabled, cacheTime: 0 },
  );
  return queryResult;
}
