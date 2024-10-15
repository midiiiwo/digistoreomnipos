import { useQuery } from 'react-query';
import { getMerchantDetails } from '../api/merchant';

export function useGetMerchantDetails(merchant) {
  const queryResult = useQuery(
    ['merchant-details', merchant],
    () => getMerchantDetails(merchant),
    { staleTime: 0 },
  );
  return queryResult;
}
