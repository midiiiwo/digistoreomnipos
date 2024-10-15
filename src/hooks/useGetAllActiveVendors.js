import { useQuery } from 'react-query';
import { getAllActiveVendors } from '../api/paypoint';

export function useGetAllActiveVendors() {
  const queryResult = useQuery(
    ['all-active-vendors'],
    () => getAllActiveVendors(),
    { staleTime: 0 },
  );
  return queryResult;
}
