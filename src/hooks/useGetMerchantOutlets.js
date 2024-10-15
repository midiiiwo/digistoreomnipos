import { useQuery } from 'react-query';
import { getMerchantOutlets } from '../api/sales';

export function useGetMerchantOutlets(merchant) {
  const queryResult = useQuery(
    ['merchant-outlets', merchant],
    () => getMerchantOutlets(merchant),
    { staleTime: 0 },
  );
  return queryResult;
}
