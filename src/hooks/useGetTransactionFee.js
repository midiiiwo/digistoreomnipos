import { useQuery } from 'react-query';
import { getTransactionFee } from '../api/sales';

export function useGetTransactionFee(
  payChannel,
  subTotal,
  merchant,
  enabled = false,
) {
  const queryResult = useQuery(
    ['transaction-fee', payChannel, subTotal],
    () => getTransactionFee(payChannel, subTotal, merchant),
    { enabled, cacheTime: Infinity, staleTime: 0 },
  );
  return queryResult;
}
