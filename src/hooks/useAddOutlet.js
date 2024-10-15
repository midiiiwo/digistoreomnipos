import { useMutation } from 'react-query';
import { addOutlet } from '../api/merchant';

export function useAddOutlet(handleSuccess) {
  const queryResult = useMutation(
    ['add-outlet'],
    payload => {
      try {
        return addOutlet(payload);
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
