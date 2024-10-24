import { useMutation } from 'react-query';
import { getAllOrders_ } from '../api/orders';

export function useGetOrders(handleSuccess) {
  const queryResult = useMutation(
    ['all-orders'],
    payload => {
      try {
        return getAllOrders_(payload);
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
