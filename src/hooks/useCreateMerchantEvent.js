import { useMutation } from 'react-query';
import { createMerchantEvent } from '../api/tickets';

export function useCreateMerchantEvent(handleSuccess) {
  const queryResult = useMutation(
    ['create-merchant-event'],
    payload => {
      try {
        return createMerchantEvent(payload);
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
