import { useMutation } from 'react-query';
import { addCategoryProduct } from '../api/products';

export function useAddCategoryProduct(handleSuccess) {
  const queryResult = useMutation(
    ['add-category-product'],
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
