import { useMutation } from 'react-query';
import { removeStoreOrLandingBanner } from '../api/merchant';

export function useRemoveStoreOrLandingBanner(handleSuccess) {
  const queryResult = useMutation(
    ['remove-store-banner'],
    payload => {
      try {
        return removeStoreOrLandingBanner(payload);
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
