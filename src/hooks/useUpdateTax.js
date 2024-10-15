import { useMutation } from 'react-query';
import { updateTax } from '../api/merchant';

export function useUpdateTax(handleSuccess) {
  const queryResult = useMutation(
    ['update-tax'],
    payload => {
      try {
        return updateTax(payload);
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
