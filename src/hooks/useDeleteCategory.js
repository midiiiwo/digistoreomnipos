import { useMutation } from 'react-query';
import { deleteCategory } from '../api/products';

export function useDeleteCategory(handleSuccess) {
  const queryResult = useMutation(
    ['delete-category'],
    payload => {
      try {
        return deleteCategory(payload.category);
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
