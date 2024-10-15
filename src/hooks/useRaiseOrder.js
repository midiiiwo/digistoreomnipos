import { useMutation, useQueryClient } from 'react-query';
import { raiseOrder } from '../api/sales';

export function useRaiseOrder(handleSuccess) {
  const queryClient = useQueryClient();
  const queryResult = useMutation(
    ['raise-order'],
    payload => raiseOrder(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
        queryClient.getMutationCache().clear();
      },
    },
  );
  return queryResult;
}
