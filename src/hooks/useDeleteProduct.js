import { useMutation, useQueryClient } from 'react-query';
import { deleteProduct } from '../api/products';

export function useDeleteProduct(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-product'],
    payload => {
      try {
        return deleteProduct(payload.merchant, payload.id, payload.userName);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        client.invalidateQueries('global-products');
        console.log(data.data);
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
