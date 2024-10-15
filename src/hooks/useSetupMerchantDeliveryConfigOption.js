import { useMutation } from 'react-query';
import { setupMerchantDeliveryConfigOption } from '../api/merchant';

export function useSetupMerchantDeliveryConfigOption(handleSuccess) {
  const queryResult = useMutation(
    ['delivery-config-option'],
    payload => {
      try {
        return setupMerchantDeliveryConfigOption(payload);
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
