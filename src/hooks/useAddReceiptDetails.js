import { useMutation } from 'react-query';
import { addReceipt } from '../api/merchant';

export function useAddReceiptDetails(handleSuccess) {
  const queryResult = useMutation(
    ['add-receipt'],
    payload => {
      try {
        return addReceipt(payload);
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
