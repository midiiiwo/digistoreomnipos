import { useQuery } from 'react-query';
import { getOrderStats } from '../api/merchant';

export function useGetOrderStats(merchant, startDate, endDate) {
  const queryResult = useQuery(
    ['order-stats', merchant, startDate, endDate],
    () => getOrderStats(merchant, startDate, endDate),
  );
  return queryResult;
}
