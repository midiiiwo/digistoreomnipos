import { useQuery } from 'react-query';
import { getAirtimeHistory } from '../api/merchant';

export function useGetAirtimeHistory(
  merchant,
  userId,
  admin,
  startDate,
  endDate,
) {
  const queryResult = useQuery(
    ['airtime-history', merchant, startDate, endDate],
    () => getAirtimeHistory(merchant, userId, admin, startDate, endDate),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
