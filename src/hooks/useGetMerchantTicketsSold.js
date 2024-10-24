import { useQuery } from 'react-query';
import { getMerchantTicketsSold } from '../api/tickets';

export function useGetMerchantTicketsSold(merchant, startDate, endDate) {
  const queryResult = useQuery(
    ['merchant-sold-tickets', merchant, startDate, endDate],
    () => getMerchantTicketsSold(merchant, startDate, endDate),
  );
  return queryResult;
}
