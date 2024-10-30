import { useMutation } from 'react-query';
import { buyAirtime } from '../api/paypoint';

export function useBuyAirtime(handleSuccess) {
  const queryResult = useMutation(
    ['buy-airtime'],
    payload => {
      try {
        return buyAirtime(payload);
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
