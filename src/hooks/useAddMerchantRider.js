import { useMutation } from 'react-query';
import { addMerchantRider } from '../api/merchant';

export function useAddMerchantRider(handleSuccess) {
  const queryResult = useMutation(
    ['add-rider'],
    payload => {
      try {
        return addMerchantRider(payload);
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
