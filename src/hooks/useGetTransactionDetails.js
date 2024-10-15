import { useQuery } from 'react-query';
import { getTransactionDetails } from '../api/merchant';

export function useGetTransactionDetails(
  user_merchant_receivable,
  id,
  enabled = false,
) {
  const queryResult = useQuery(
    ['transaction-details', user_merchant_receivable, id],
    () => getTransactionDetails(user_merchant_receivable, id),
    { staleTime: 0 },
  );
  return queryResult;
}
