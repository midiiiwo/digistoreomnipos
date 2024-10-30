import { useQuery } from 'react-query';
import { getPaymentStatus } from '../api/sales';

export function useGetPaymentStatus(
  merchant,
  invoice,
  refetchInterval,
  enabled,
) {
  const queryResult = useQuery(
    ['payment-status', merchant, invoice],
    () => getPaymentStatus(merchant, invoice),
    {
      enabled: !!enabled,
      refetchInterval,
      staleTime: 0,
      cacheTime: 0,
    },
  );
  return queryResult;
}
