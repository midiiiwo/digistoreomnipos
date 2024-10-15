import { useMutation } from 'react-query';
import { addMerchantDeliveryRoute } from '../api/merchant';

export function useAddMerchantRoute(handleSuccess) {
  const queryResult = useMutation(
    ['add-route'],
    payload => {
      try {
        return addMerchantDeliveryRoute(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
