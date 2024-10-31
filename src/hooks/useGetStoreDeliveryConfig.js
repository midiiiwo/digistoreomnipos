import { useQuery } from 'react-query';
import { getStoreDeliveryConfig } from '../api/merchant';

export function useGetStoreDeliveryConfig(merchant) {
  const queryResult = useQuery(['store-delivery-config', merchant], () =>
    getStoreDeliveryConfig(merchant),
  );

  return {
    ...queryResult,
    deliveryType: queryResult.data?.message?.delivery_type,
  };
}
