import { useMutation } from 'react-query';
import { requestTransferFunds } from '../api/merchant';

export function useRequestTransferFunds(handleSuccess) {
  const queryResult = useMutation(
    ['request-transfer-funds'],
    payload => {
      try {
        return requestTransferFunds(payload);
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
