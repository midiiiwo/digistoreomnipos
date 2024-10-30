import { useMutation } from 'react-query';
import { paybill } from '../api/paypoint';

export function usePayBill(handleSuccess) {
  const queryResult = useMutation(
    ['paybill'],
    payload => {
      try {
        return paybill(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data?.data);
      },
    },
  );
  return queryResult;
}
