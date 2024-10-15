import { useMutation } from 'react-query';
import { receiveQuickPayment } from '../api/quickSales';

export function useReceiveQuickPayment(handleSuccess) {
  const queryResult = useMutation(
    ['receive-quick-payment'],
    payload => receiveQuickPayment(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
