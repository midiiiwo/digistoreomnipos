import { useMutation } from 'react-query';
import { addWallet } from '../api/merchant';

export function useAddWallet(handleSuccess) {
  const queryResult = useMutation(
    ['add-wallet'],
    payload => {
      try {
        return addWallet(payload);
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
