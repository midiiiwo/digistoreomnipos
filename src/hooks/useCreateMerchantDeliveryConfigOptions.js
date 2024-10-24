import { useMutation } from 'react-query';
import { createMerchantDeliveryConfigOption } from '../api/merchant';

export function useCreateMerchantDeliveryConfigOption(handleSuccess) {
  const queryResult = useMutation(
    ['delivery-config-option'],
    payload => {
      try {
        return createMerchantDeliveryConfigOption(payload);
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
