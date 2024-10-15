import { useQuery } from 'react-query';
import { getAllTickets } from '../api/paypoint';

export function useGetAllTickets(userLogin, enabled) {
  const queryResult = useQuery(
    ['all-tickets', userLogin],
    () => getAllTickets(userLogin),
    { staleTime: 0 },
  );
  return queryResult;
}
