import { useQuery } from 'react-query';
import { getAccountList } from '../api/merchant';

export function useGetAccountList(user_merchant_account) {
  const queryResult = useQuery(
    ['account-list', user_merchant_account],
    () => getAccountList(user_merchant_account),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
