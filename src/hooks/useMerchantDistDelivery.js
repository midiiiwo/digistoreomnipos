import { useMutation } from 'react-query';
import { merchantDistDelivery } from '../api/sales';

export function useMerchantDistDelivery(handleSuccess) {
  const queryResult = useMutation(
    ['merchant-dist-delivery'],
    payload => {
      try {
        return merchantDistDelivery(payload);
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
