import { useMutation } from 'react-query';
import { deleteOutlet } from '../api/merchant';

export function useDeleteOutlet(handleSuccess) {
  const queryResult = useMutation(
    ['delete-outlet'],
    payload => {
      try {
        return deleteOutlet(payload);
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
