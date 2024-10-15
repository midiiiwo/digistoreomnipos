import { useMutation } from 'react-query';
import { getAreaBasedDelivery } from '../api/sales';

export function useGetAreaBasedDelivery(handleSuccess) {
  const queryResult = useMutation(
    ['area-based-delivery'],
    payload => getAreaBasedDelivery(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data.data);
      },
    },
  );
  return queryResult;
}
