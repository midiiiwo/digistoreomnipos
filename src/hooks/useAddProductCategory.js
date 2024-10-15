import { useMutation } from 'react-query';
import { addCategoryProduct } from '../api/products';

export function useAddProductCategory(handleSuccess) {
  const queryResult = useMutation(
    ['add-product-category'],
    payload => {
      try {
        return addCategoryProduct(payload);
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
