import { useQuery } from 'react-query';
import { getMerchantUserRoles } from '../api/merchant';

export function useGetMerchantUserRoles(merchant) {
  const queryResult = useQuery(['merchant-user-roles', merchant], () =>
    getMerchantUserRoles(merchant),
  );
  return queryResult;
}
