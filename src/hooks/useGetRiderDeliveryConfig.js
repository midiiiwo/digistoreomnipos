import { useQuery } from 'react-query';
import { getRiderDeliveryConfig } from '../api/merchant';

export function useGetRiderDeliveryConfig(merchant) {
    const queryResult = useQuery(['store-delivery-config', merchant], () =>
        getRiderDeliveryConfig(merchant),
    );

    return {
        ...queryResult,
        deliveryType: queryResult.data?.message?.delivery_type,
    };
}
