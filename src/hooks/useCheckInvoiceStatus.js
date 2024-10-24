import { useMutation, useQueryClient } from 'react-query';
import { checkInvoiceStatus } from '../api/merchant';

export function useCheckInvoiceStatus(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['check-invoice-status'],
    //@ts-ignore
    payload => {
      try {
        return checkInvoiceStatus(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
        client.invalidateQueries('payments-history');
      },
    },
  );
  return queryResult;
}
