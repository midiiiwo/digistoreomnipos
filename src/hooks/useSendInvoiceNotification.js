import { useMutation } from 'react-query';
import { sendInvoiceNotification } from '../api/sales';

export function useSendInvoiceNotification(handleSuccess) {
  const queryResult = useMutation(
    ['send-invoice-notification'],
    payload => {
      try {
        return sendInvoiceNotification(payload);
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
