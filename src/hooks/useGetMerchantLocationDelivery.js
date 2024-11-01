import { useQuery } from 'react-query';
import { getMerchantLocationDelivery } from '../api/sales';

export function useGetMerchantLocationDelivery(merchant, outlet_id) {
  const queryResult = useQuery(
    ['merchant-delivery', merchant, outlet_id],
    () => getMerchantLocationDelivery(merchant, outlet_id),
    { staleTime: 0 },
  );
  return queryResult;
}
