import { useMutation } from 'react-query';
import { deleteMerchantUser } from '../api/merchant';

export function useDeleteMerhantUser(handleSuccess) {
  // const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-merchant-user'],
    payload => {
      try {
        return deleteMerchantUser(payload);
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
