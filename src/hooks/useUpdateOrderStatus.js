import { useMutation } from 'react-query';
import { updateOrderStatus } from '../api/orders';

export function useUpdateOrderStatus(handleSuccess) {
  const queryResult = useMutation(
    ['delivery-status'],
    payload => updateOrderStatus(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
