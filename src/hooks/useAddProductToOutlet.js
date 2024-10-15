import { useMutation } from 'react-query';
import { addProductToOutlet } from '../api/products';

export function useAddProductToOutlet(handleSuccess) {
  const queryResult = useMutation(
    ['add-product-to-outlet'],
    payload => {
      try {
        return addProductToOutlet(payload);
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
