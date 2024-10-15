import { useMutation } from 'react-query';
import { getAllOrderNonAdmin } from '../api/orders';

export function useGetOrdersNonAdmin(handleSuccess) {
  const queryResult = useMutation(
    ['all-orders'],
    payload => {
      try {
        return getAllOrderNonAdmin(payload);
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
