import { useMutation } from 'react-query';
import { editCustomerLocation } from '../api/merchant';

export function useEditCustomerLocation(handleSuccess) {
  const queryResult = useMutation(
    ['edit-customer-location'],
    payload => {
      try {
        return editCustomerLocation(payload);
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
