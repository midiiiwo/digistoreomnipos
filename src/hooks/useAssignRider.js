import { useMutation } from 'react-query';
import { assignRider } from '../api/orders';

export function useAssignRider(handleSuccess) {
  const queryResult = useMutation(
    ['assign-rider'],
    payload => assignRider(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
