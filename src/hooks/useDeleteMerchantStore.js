import { useMutation } from 'react-query';
import { deleteMerchantStore } from '../api/merchant';

export function useDeleteMerchantStore(handleSuccess) {
  // const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-merchant-store'],
    payload => {
      try {
        return deleteMerchantStore(payload);
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
