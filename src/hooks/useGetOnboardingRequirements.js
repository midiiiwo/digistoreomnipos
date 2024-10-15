import { useQuery } from 'react-query';
import { getOnboardingRequirements } from '../api/merchant';

export function useGetOnboardingRequirements() {
  const queryResult = useQuery(['onboarding-requirements'], () =>
    getOnboardingRequirements(),
  );
  return queryResult;
}
