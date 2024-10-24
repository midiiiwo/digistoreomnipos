import { useQuery } from 'react-query';
import { getMerchantEvents } from '../api/tickets';

export function useGetMerchantEvents(merchant) {
  const queryResult = useQuery(
    ['merchant-events', merchant],
    () => getMerchantEvents(merchant),
    { staleTime: 0 },
  );
  return queryResult;
}
