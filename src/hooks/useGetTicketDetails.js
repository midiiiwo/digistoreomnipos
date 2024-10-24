import { useQuery } from 'react-query';
import { getTicketDetails } from '../api/tickets';

export function useGetTicketDetails(ticket_id) {
  const queryResult = useQuery(['ticket-details', ticket_id], () =>
    getTicketDetails(ticket_id),
  );
  return queryResult;
}
