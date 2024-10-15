import { useQuery } from 'react-query';
import { getAccountBalance } from '../api/merchant';

export function useGetAccountBalance(user_merchant_account) {
  const queryResult = useQuery(
    ['account-balance', user_merchant_account],
    () => getAccountBalance(user_merchant_account),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
