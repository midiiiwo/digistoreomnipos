import { useQuery } from 'react-query';
import { getMerchantDeliveryWindow } from '../api/merchant';

export function useGetMerchantDeliveryWindow(merchant, outlet_id) {
    const queryResult = useQuery(
        ['merchant-delivery', merchant, outlet_id],
        () => getMerchantDeliveryWindow(merchant, outlet_id),
        { staleTime: 0 },
    );
    return queryResult;
}
