import { useQuery } from 'react-query';
import { getOutletDetails } from '../api/merchant';

export function useGetOutletDetails(id) {
  const queryResult = useQuery(
    ['outlet-details', id],
    () => getOutletDetails(id),
    {},
  );
  return queryResult;
}
