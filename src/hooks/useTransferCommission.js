import { useMutation } from 'react-query';
import { transferCommission } from '../api/paypoint';

export function useTransferCommission(handleSuccess) {
  const queryResult = useMutation(
    ['tranfer-commission'],
    payload => {
      try {
        return transferCommission(payload);
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
