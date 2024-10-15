import { useQuery } from 'react-query';
import { getMerchantUserOutlets } from '../api/merchant';

export function useGetMerchantUserOutlets(merchant, userId) {
  const queryResult = useQuery(['merchant-user-outlets', merchant], () =>
    getMerchantUserOutlets(merchant, userId),
  );
  return queryResult;
}
