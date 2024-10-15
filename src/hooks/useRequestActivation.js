import { useMutation, useQueryClient } from 'react-query';
import { requestActivation } from '../api/merchant';

export function useRequestActivation(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ['request-activation'],
    payload => {
      try {
        return requestActivation(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
        client.invalidateQueries('current-activation-step');
      },
    },
  );
  return queryResult;
}
