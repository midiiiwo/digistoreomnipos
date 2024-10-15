import { useMutation } from 'react-query';
import { applyDiscountCode } from '../api/sales';

export function useApplyDiscountCode(handleSuccess) {
  const queryResult = useMutation(
    ['apply-discount-code'],
    payload => applyDiscountCode(payload),
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
