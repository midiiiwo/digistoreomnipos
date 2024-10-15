import { useQuery } from 'react-query';
import { getOnlineStoreDetails } from '../api/merchant';

export function useGetOnlineStoreDetails(merchant) {
  const queryResult = useQuery(
    ['online-store', merchant],
    () => getOnlineStoreDetails(merchant),
    {},
  );
  return queryResult;
}
