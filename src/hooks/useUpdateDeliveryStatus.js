import { useMutation } from 'react-query';
import { updateDeliveryStatus } from '../api/orders';

export function useUpdateDeliveryStatus(handleSuccess) {
  const queryResult = useMutation(
    ['delivery-status'],
    payload => updateDeliveryStatus(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
