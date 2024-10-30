import { useMutation } from 'react-query';
import { updateInventoryStockQuantity } from '../api/products';

export function useUpdateInventoryStockQuantity(handleSuccess) {
  const queryResult = useMutation(
    ['inventory-stock-quantity'],
    payload => {
      try {
        return updateInventoryStockQuantity(payload);
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
