import { useQuery } from 'react-query';
import { getMerchantOutlets } from '../api/sales';

export function useGetMerchantOutlets(merchant) {
  const queryResult = useQuery(
    ['merchant-outlets', merchant],
    () => getMerchantOutlets(merchant),
    {
      staleTime: 600000,
      cacheTime: 0,
      refetchOnWindowFocus: true,
    },
  );
  return queryResult;
}
