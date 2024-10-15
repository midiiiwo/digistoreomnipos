import { useQuery } from 'react-query';
import { getQuickPaymentStatus } from '../api/quickSales';

export function useGetQuickPaymentStatus(merchant, invoice, enabled = true) {
  const queryResult = useQuery(
    ['quick-payment-status', merchant, invoice],
    () => getQuickPaymentStatus(merchant, invoice),
    { enabled, refetchInterval: 2000, staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
