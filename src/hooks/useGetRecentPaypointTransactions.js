import { useQuery } from 'react-query';
import { getRecentPaypointTransactions } from '../api/paypoint';

export function useGetRecentPaypointTransactions(
  merchant,
  userLogin,
  startDate,
  endDate,
  admin,
) {
  const queryResult = useQuery(
    ['get-recent-paypoint-transactions'],
    () =>
      getRecentPaypointTransactions(
        merchant,
        userLogin,
        startDate,
        endDate,
        admin,
      ),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
