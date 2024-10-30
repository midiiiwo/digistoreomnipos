import { useMutation } from 'react-query';
import { verifyOnboardingOtp } from '../api/merchant';

export function useVerifyOnboardingAccount(handleSuccess) {
  const queryResult = useMutation(
    ['validate-onboarding-otp'],
    payload => {
      try {
        return verifyOnboardingOtp(payload);
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
