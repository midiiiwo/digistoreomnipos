import { useMutation } from 'react-query';
import { replaceStoreBanner } from '../api/merchant';

export function useReplaceStoreBanner(handleSuccess) {
  const queryResult = useMutation(
    ['replace-store-banner'],
    payload => {
      try {
        return replaceStoreBanner(payload);
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
