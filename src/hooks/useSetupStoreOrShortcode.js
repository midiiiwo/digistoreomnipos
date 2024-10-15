import { useMutation } from 'react-query';
import { setupStoreOrShortcode } from '../api/merchant';

export function useSetupStoreOrShortcode(handleSuccess) {
  const queryResult = useMutation(
    ['setup-store-or-shortcode'],
    payload => {
      try {
        return setupStoreOrShortcode(payload);
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
