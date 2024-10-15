import { useQuery } from 'react-query';
import { getPreactiveState } from '../api/merchant';

export function useGetPreactiveState(merchant) {
  const queryResult = useQuery(['pre-active-state', merchant], () =>
    getPreactiveState(merchant),
  );
  return queryResult;
}
