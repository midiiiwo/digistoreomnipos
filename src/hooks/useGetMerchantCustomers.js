import { useQuery } from 'react-query';
import { getMerchantCustomers } from '../api/sales';

export function useGetMerchantCustomers(merchant) {
  const queryResult = useQuery(
    ['merchant-customers', merchant],
    () => getMerchantCustomers(merchant),
    {
      staleTime: 0,
    },
  );
  return queryResult;
}
