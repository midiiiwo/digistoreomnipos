import { useMutation } from 'react-query';
import { deleteMerchantEvent } from '../api/tickets';

export function useDeleteMerchantEvent(handleSuccess) {
  const queryResult = useMutation(
    ['delete-merchant-event'],
    payload => {
      try {
        return deleteMerchantEvent(payload);
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
