import { useQuery } from 'react-query';
import { getTransferFundsAccount } from '../api/merchant';

export function useGetTransferFundsAccount(user_merchant_account) {
  const queryResult = useQuery(
    ['get-transfer-funds-account'],
    () => getTransferFundsAccount(user_merchant_account),
    { staleTime: 0, cacheTime: Infinity },
  );
  return queryResult;
}
