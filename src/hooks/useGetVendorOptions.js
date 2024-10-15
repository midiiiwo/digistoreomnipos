import { useQuery } from 'react-query';
import { getVendorOptions } from '../api/paypoint';

export function useGetVendorOptions(vendor, account, enabled) {
  const queryResult = useQuery(
    ['vendor-options'],
    () => getVendorOptions(vendor, account),
    { staleTime: 0, cacheTime: Infinity, enabled },
  );
  return queryResult;
}
