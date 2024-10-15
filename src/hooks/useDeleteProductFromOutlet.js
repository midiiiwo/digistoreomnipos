import { useMutation, useQueryClient } from 'react-query';
import { deleteProductFromOutlet } from '../api/products';

export function useDeleteProductFromOutlet(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['delete-product-outlet'],
    payload => {
      try {
        return deleteProductFromOutlet(
          payload.outlet,
          payload.merchant,
          payload.id,
          payload.userName,
        );
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
