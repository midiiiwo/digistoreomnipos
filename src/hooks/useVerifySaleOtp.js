import { useMutation } from 'react-query';
import { verifySaleOtp } from '../api/sales';

export function useVerifySaleOtp(handleSuccess) {
  const queryResult = useMutation(
    ['verify-sale-otp'],
    payload => {
      try {
        return verifySaleOtp(payload);
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
