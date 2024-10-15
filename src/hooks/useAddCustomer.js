import { useMutation } from 'react-query';
import { addCustomer } from '../api/merchant';

export function useAddCustomer(handleSuccess) {
  const queryResult = useMutation(
    ['add-customer'],
    payload => {
      try {
        return addCustomer(payload);
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
