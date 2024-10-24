import { useMutation } from 'react-query';
import { editMerchantEvent } from '../api/tickets';

export function useEditMerchantEvent(handleSuccess) {
  const queryResult = useMutation(
    ['edit-merchant-event'],
    payload => {
      try {
        return editMerchantEvent(payload);
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
