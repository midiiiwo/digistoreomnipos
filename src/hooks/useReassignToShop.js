import { useMutation } from 'react-query';
import { reassignToShop } from '../api/orders';

export function useReassignToShop(handleSuccess) {
  const queryResult = useMutation(
    ['ressign-to-shop'],
    payload => reassignToShop(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
