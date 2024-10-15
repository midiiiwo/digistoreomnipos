import { useMutation } from 'react-query';
import { requestGenericOtp } from '../api/merchant';

export function useRequestGenericOtp(handleSuccess) {
  // const client = useQueryClient();
  const queryResult = useMutation(
    ['generic-otp'],
    payload => {
      try {
        return requestGenericOtp(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess && handleSuccess(data.data);
        // client.invalidateQueries('current-activation-step');
      },
    },
  );
  return queryResult;
}
