import { useMutation } from 'react-query';
import { voidOrder } from '../api/orders';

export function useVoidOrder(handleSuccess) {
  const queryResult = useMutation(
    ['void-order'],
    payload => {
      try {
        return voidOrder(payload);
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
