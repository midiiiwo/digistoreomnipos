import { useMutation } from 'react-query';
import { editReceipt } from '../api/merchant';

export function useEditReceipt(handleSuccess) {
  const queryResult = useMutation(
    ['edit-receipt'],
    payload => {
      try {
        return editReceipt(payload);
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
