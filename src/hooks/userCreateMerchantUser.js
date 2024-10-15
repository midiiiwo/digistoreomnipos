import { useMutation } from 'react-query';
import { createMerchantUser } from '../api/merchant';

export function useCreateMerchantUser(handleSuccess) {
  const queryResult = useMutation(
    ['create-merchant-user'],
    payload => {
      try {
        return createMerchantUser(payload);
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
