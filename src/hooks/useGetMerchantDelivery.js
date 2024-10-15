import { useQuery } from 'react-query';
import { getMerchantDelivery } from '../api/sales';

export function useGetMerchantDelivery(merchant) {
  const queryResult = useQuery(
    ['merchant-delivery', merchant],
    () => getMerchantDelivery(merchant),
    { staleTime: 0 },
  );
  return queryResult;
}
