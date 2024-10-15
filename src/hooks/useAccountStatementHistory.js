import { useQuery } from 'react-query';
import { getAccountStatementHistory } from '../api/merchant';

export function useAccountStatementHistory(merchant, startDate, endDate) {
  const queryResult = useQuery(
    ['account-statement', merchant, startDate, endDate],
    () => getAccountStatementHistory(merchant, startDate, endDate),
    // { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
