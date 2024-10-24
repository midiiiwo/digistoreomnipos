import { useQuery } from 'react-query';
import { getEventTickets } from '../api/tickets';

export function useGetEventTickets(eventCode) {
  const queryResult = useQuery(['event-tickets', eventCode], () =>
    getEventTickets(eventCode),
  );
  return queryResult;
}
