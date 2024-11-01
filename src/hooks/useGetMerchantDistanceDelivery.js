import { useQuery } from 'react-query';
import { getMerchantDistanceDelivery } from '../api/sales';

export function useGetMerchantDistanceDelivery(merchant, outlet_id) {
    const queryResult = useQuery(
        ['merchant-delivery', merchant, outlet_id],
        () => getMerchantDistanceDelivery(merchant, outlet_id),
        { staleTime: 0 },
    );
    return queryResult;
}
