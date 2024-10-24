import { useQuery } from 'react-query';
import { getEventTicketCode } from '../api/tickets';

export function useGetEventTicketCode(
  merchant,
  ticketName,
  onSuccess,
  enabled = false,
) {
  const queryResult = useQuery(
    ['event-ticket-code', merchant, ticketName],
    () => getEventTicketCode(merchant, ticketName),
    { enabled, onSuccess },
  );
  return queryResult;
}
