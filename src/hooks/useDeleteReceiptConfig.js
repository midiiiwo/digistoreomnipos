import { useMutation, useQueryClient } from 'react-query';
import { deleteReceipt } from '../api/merchant';

export function useDeleteReceiptConfig(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-receipt-config'],
    payload => {
      try {
        return deleteReceipt(payload.id, payload.userName);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        client.invalidateQueries('get-receipt-details');
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
