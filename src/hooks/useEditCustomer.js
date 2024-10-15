import { useMutation } from 'react-query';
import { editCustomer } from '../api/merchant';

export function useEditCustomer(handleSuccess) {
  const queryResult = useMutation(
    ['edit-customer'],
    payload => {
      try {
        return editCustomer(payload);
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
