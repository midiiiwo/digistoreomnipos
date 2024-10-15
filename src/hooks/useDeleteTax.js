import { useMutation } from 'react-query';
import { deleteTax } from '../api/merchant';

export function useDeleteTax(handleSuccess) {
  const queryResult = useMutation(
    ['delete-tax'],
    payload => {
      try {
        return deleteTax(payload.id, payload.user);
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
