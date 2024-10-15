import { useMutation } from 'react-query';
import { deleteMerchantAccount } from '../api/merchant';

export function useDeleteMerchantAccount(handleSuccess) {
  const queryResult = useMutation(
    ['delete-merchant-account'],
    payload => {
      try {
        return deleteMerchantAccount(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        // client.invalidateQueries('global-products');
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
