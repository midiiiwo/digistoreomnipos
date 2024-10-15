import { useMutation } from 'react-query';
import { editCategory } from '../api/products';

export function useEditCategory(handleSuccess) {
  const queryResult = useMutation(
    ['edit-category'],
    payload => {
      try {
        return editCategory(payload);
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
