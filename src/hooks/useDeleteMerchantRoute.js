import { useMutation, useQueryClient } from 'react-query';
import { deleteMerchantDeliveryRoute } from '../api/merchant';

export function useDeleteMerchantRoute(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-route'],
    payload => {
      try {
        return deleteMerchantDeliveryRoute(payload.id);
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
