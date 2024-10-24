import { useQuery } from 'react-query';
import { getUserTicketHistory } from '../api/tickets';

export function useGetUserTicketHistory(user) {
  const queryResult = useQuery(['ticket-history', user], () =>
    getUserTicketHistory(user),
  );
  return queryResult;
}
