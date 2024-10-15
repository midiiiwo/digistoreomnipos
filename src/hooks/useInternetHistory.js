import { useQuery } from 'react-query';
import { InternetHistory } from '../api/merchant';

export function useGetInternetHistory(
  merchant,
  userId,
  admin,
  startDate,
  endDate,
) {
  const queryResult = useQuery(
    ['internet-history', merchant, startDate, endDate],
    () => InternetHistory(merchant, userId, admin, startDate, endDate),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
