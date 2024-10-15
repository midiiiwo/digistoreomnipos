import { useMutation } from 'react-query';
import { activeWalletAccount } from '../api/merchant';

export function useActiveWalletAccount(handleSuccess) {
  const queryResult = useMutation(
    ['activate-wallet-account'],
    payload => {
      try {
        return activeWalletAccount(payload);
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
