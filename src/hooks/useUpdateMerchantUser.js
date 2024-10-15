import { useMutation } from 'react-query';
import { updateMerchantUser } from '../api/merchant';

export function useUpdateMerchantUser(handleSuccess) {
  const queryResult = useMutation(
    ['update-merchant-user'],
    payload => {
      try {
        return updateMerchantUser(payload);
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
