import { useQuery } from 'react-query';
import { SendMoneyHistory } from '../api/merchant';

export function useGetSendMoneyHistory(
  merchant,
  userId,
  admin,
  startDate,
  endDate,
) {
  const queryResult = useQuery(
    ['sendmoney-history', merchant, startDate, endDate],
    () => SendMoneyHistory(merchant, userId, admin, startDate, endDate),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
