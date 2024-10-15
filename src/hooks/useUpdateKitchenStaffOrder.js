import { useMutation } from 'react-query';
import { updateKitchenStaffOrder } from '../api/orders';

export function useUpdateKitchenStaffOrder(handleSuccess) {
  const queryResult = useMutation(
    ['kitchen-staff-order'],
    payload => {
      try {
        return updateKitchenStaffOrder(payload);
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
