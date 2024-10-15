import { useMutation } from 'react-query';
import { cancelFundsTransfer } from '../api/merchant';

export function useCancelFundsTransfer(handleSuccess) {
  const queryResult = useMutation(
    ['cancel-funds-transfer'],
    payload => {
      try {
        return cancelFundsTransfer(payload);
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
