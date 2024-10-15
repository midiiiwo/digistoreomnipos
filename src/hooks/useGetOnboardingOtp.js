import { useMutation } from 'react-query';
import { getOnboardingOtp } from '../api/merchant';

export function useGetOnboardingOtp(handleSuccess) {
  const queryResult = useMutation(
    ['onboarding-otp'],
    payload => {
      try {
        return getOnboardingOtp(payload);
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
