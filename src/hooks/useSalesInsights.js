import { useMutation } from 'react-query';
import { salesInsights } from '../api/merchant';

export function useSalesInsights(handleSuccess) {
  const queryResult = useMutation(
    ['sale-insights'],
    payload => {
      try {
        return salesInsights(payload);
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
