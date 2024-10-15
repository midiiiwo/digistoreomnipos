import { useMutation } from 'react-query';
import { addCategory } from '../api/products';

export function useAddCategory(handleSuccess) {
  const queryResult = useMutation(
    ['add-category'],
    payload => {
      try {
        return addCategory(payload);
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
