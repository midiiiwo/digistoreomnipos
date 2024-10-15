import { useMutation } from 'react-query';
import { changeTaxStatus } from '../api/merchant';

export function useChangeTaxStatus(handleSuccess) {
  const queryResult = useMutation(
    ['tax-status'],
    payload => {
      try {
        return changeTaxStatus(payload);
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
