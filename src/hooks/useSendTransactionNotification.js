import { useMutation, useQueryClient } from 'react-query';
import { sendTransactionNotification } from '../api/sales';

export function useSendTransactionNotification(handleSuccess) {
  const queryClient = useQueryClient();
  const queryResult = useMutation(
    ['transaction-notification'],
    payload => sendTransactionNotification({ ...payload, notify_message: '' }),
    {
      onSuccess(data) {
        handleSuccess(data.data);
        queryClient.getMutationCache().clear();
      },
    },
  );
  return queryResult;
}
