import { useQuery } from 'react-query';
import { getStoreOutlets } from '../api/sales';

export function useGetStoreOutlets(merchant) {
  const queryResult = useQuery(['all-store-outlets', merchant], () =>
    getStoreOutlets(merchant),
  );
  return queryResult;
}
