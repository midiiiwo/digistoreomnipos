import { useQuery } from 'react-query';
import { addMoneyStatus } from '../api/merchant';

export function useAddMoneyStatus(invoice, enabled = false) {
  const queryResult = useQuery(
    ['add-money-status', invoice],
    () => addMoneyStatus(invoice),
    { enabled, refetchInterval: 1000, staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
