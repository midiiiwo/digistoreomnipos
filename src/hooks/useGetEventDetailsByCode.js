import { useQuery } from 'react-query';
import { getEventDetailsByCode } from '../api/tickets';

export function useGetEventDetailsByCode(eventCode) {
  const queryResult = useQuery(['event-details-by-code', eventCode], () =>
    getEventDetailsByCode(eventCode),
  );
  return queryResult;
}
