import { useMutation } from 'react-query';
import { getCustomerAnalytics } from '../api/merchant';

export function useGetCustomerAnalytics(handleSuccess) {
  const queryResult = useMutation(
    ['customer-analytics'],
    payload => {
      try {
        return getCustomerAnalytics(payload);
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
