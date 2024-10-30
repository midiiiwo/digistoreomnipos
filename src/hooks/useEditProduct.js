import { useMutation } from 'react-query';
import { editProduct_ } from '../api/products';

export function useEditProduct(handleSuccess) {
  const queryResult = useMutation(
    ['edit-product'],
    payload => {
      try {
        return editProduct_(payload);
      } catch (error) {
        console.log('thiserrr', error);
      }
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
