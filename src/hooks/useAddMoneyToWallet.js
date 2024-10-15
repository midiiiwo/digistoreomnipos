import { useMutation } from 'react-query';
import { addMoneyToWallet } from '../api/merchant';

export function useAddMoneyToWallet(handleSuccess) {
  const queryResult = useMutation(
    ['add-money-to-wallet'],
    payload => {
      try {
        return addMoneyToWallet(payload);
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
