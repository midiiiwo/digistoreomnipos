import { useQuery } from 'react-query';
import { BillPaymentHistory } from '../api/merchant';

export function useGetBillPaymentHistory(
  merchant,
  userId,
  admin,
  startDate,
  endDate,
) {
  const queryResult = useQuery(
    ['billpayment-history', merchant, startDate, endDate],
    () => BillPaymentHistory(merchant, userId, admin, startDate, endDate),
    { staleTime: 0, cacheTime: 0 },
  );
  return queryResult;
}
