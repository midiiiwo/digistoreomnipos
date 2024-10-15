import { useMutation } from 'react-query';
import { removeProductFromOutlet } from '../api/products';

export function useRemoveProductFromOutlet(handleSuccess) {
  const queryResult = useMutation(
    ['remove-product-from-outlet'],
    payload => {
      try {
        return removeProductFromOutlet(payload);
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
