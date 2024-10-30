import { useMutation } from 'react-query';
import { onBoardMerchant } from '../api/merchant';

export function useOnboardMerchant(handleSuccess) {
  const queryResult = useMutation(
    ['onboard-merchant'],
    payload => {
      try {
        return onBoardMerchant(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
      onError(data) {
        console.log('---------------', data);
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
