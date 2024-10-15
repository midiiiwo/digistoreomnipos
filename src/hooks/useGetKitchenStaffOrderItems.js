import { useMutation } from 'react-query';
import { getKitchStaffOrderItems } from '../api/orders';

export function useGetKitchStaffOrderItems(handleSuccess) {
  const queryResult = useMutation(
    ['kitchen-staff-order-items'],
    payload => {
      try {
        return getKitchStaffOrderItems(payload);
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
