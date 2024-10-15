import { useQuery } from 'react-query';
import { PaymentHistory } from '../api/merchant';

export function useGetSalesHistory(
  merchant,
  userId,
  admin,
  startDate,
  endDate,
) {
  const queryResult = useQuery(
    ['payments-history', merchant, startDate, endDate],
    () => PaymentHistory(merchant, userId, admin, startDate, endDate),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
