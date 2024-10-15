import { useMutation, useQueryClient } from 'react-query';
import { toggleProductOfflineOnlineEntirely } from '../api/products';

export function useToggleProductOfflineOnlineEntirely(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['toggle-product-offline-online'],
    payload => {
      try {
        return toggleProductOfflineOnlineEntirely(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
        client.invalidateQueries('outlet-products');
      },
    },
  );
  return queryResult;
}
