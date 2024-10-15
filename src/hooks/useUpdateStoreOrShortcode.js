import { useMutation } from 'react-query';
import { updateStoreOrShortcode } from '../api/merchant';

export function useUpdateStoreOrShortcode(handleSuccess) {
  const queryResult = useMutation(
    ['setup-store-or-shortcode'],
    payload => {
      try {
        return updateStoreOrShortcode(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
      onError(err) {
        console.log('errrrrrrrrrr', err);
      },
    },
  );
  return queryResult;
}
