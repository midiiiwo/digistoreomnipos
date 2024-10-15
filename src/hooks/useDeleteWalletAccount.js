import { useMutation } from 'react-query';
import { deleteWalletAccount } from '../api/merchant';

export function useDeleteWalletAccount(handleSuccess) {
  const queryResult = useMutation(
    ['delete-wallet-account'],
    payload => {
      try {
        return deleteWalletAccount(
          payload.user_merchant_account,
          payload.mobileNumber,
        );
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
