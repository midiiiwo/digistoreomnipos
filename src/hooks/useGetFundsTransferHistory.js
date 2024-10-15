import { useQuery } from 'react-query';
import { getFundsTransferHistory } from '../api/merchant';

export function useGetFundsTransferHistory(merchant, startDate, endDate) {
  const queryResult = useQuery(
    ['funds-transfer-history', merchant, startDate, endDate],
    () => getFundsTransferHistory(merchant, startDate, endDate),
    // { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
