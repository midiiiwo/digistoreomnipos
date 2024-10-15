import { useMutation } from 'react-query';
import { productAnalytics } from '../api/merchant';

export function useProductAnalytics(handleSuccess) {
  const queryResult = useMutation(
    ['product-insights'],
    payload => {
      try {
        return productAnalytics(payload);
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
