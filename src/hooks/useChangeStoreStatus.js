import { useMutation } from 'react-query';
import { changeStoreStatus } from '../api/merchant';

export function useChangeStoreStatus(handleSuccess) {
  const queryResult = useMutation(
    ['store-status'],
    payload => {
      try {
        return changeStoreStatus(payload);
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
