import { useMutation } from 'react-query';
import { updateOutlet } from '../api/merchant';

export function useUpdateOutlet(handleSuccess) {
  const queryResult = useMutation(
    ['outlets'],
    payload => updateOutlet(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
