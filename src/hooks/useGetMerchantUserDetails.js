import { useQuery } from 'react-query';
import { getMerchantUserDetails } from '../api/merchant';

export function useGetMerchantUserDetails(merchant) {
  const queryResult = useQuery(['merchant-user-details', merchant], () =>
    getMerchantUserDetails(merchant),
  );
  return queryResult;
}
