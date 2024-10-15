import { useMutation, useQueryClient } from 'react-query';
import { deleteCategory } from '../api/products';

export function useDeleteProductCategory(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-product-category'],
    payload => {
      try {
        return deleteCategory(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        client.invalidateQueries('product-categories');
        console.log(data.data);
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
