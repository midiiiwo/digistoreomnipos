import { useQuery } from 'react-query';
import { getEventDetails } from '../api/tickets';

export function useGetEventDetails(event_id) {
  const queryResult = useQuery(['event-details', event_id], () =>
    getEventDetails(event_id),
  );
  return queryResult;
}
