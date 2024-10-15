import { useMutation } from 'react-query';
import { AddTax } from '../api/merchant';

export function useAddTax(handleSuccess) {
  const queryResult = useMutation(
    ['add-tax'],
    payload => {
      try {
        return AddTax(payload);
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
