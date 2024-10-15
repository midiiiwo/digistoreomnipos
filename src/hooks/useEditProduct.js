import { useMutation } from 'react-query';
import { editProduct } from '../api/products';

export function useEditProduct(handleSuccess) {
  const queryResult = useMutation(
    ['edit-product'],
    payload => {
      try {
        return editProduct(payload);
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
