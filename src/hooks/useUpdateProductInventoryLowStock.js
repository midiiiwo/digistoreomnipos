import { useMutation } from 'react-query';
import { updateProductInventoryLowStock } from '../api/products';

export function useUpdateProductInventoryLowStock(handleSuccess) {
  const queryResult = useMutation(
    ['inventory-low-stock'],
    payload => {
      try {
        return updateProductInventoryLowStock(payload);
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
