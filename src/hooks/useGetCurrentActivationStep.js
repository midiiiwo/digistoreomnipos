import { useQuery } from 'react-query';
import { getCurrentActivationStep } from '../api/merchant';

export function useGetCurrentActivationStep(merchant) {
  const queryResult = useQuery(['current-activation-step', merchant], () =>
    getCurrentActivationStep(merchant),
  );
  return queryResult;
}
