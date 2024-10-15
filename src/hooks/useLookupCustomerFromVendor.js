import { useQuery } from 'react-query';
import { lookupCustomerFromVendor } from '../api/paypoint';
// import { useToast } from 'react-native-toast-notifications';

export function useLookupCustomerFromVendor(vendor, account, enabled = false) {
  // const toast = useToast();
  const queryResult = useQuery(
    ['lookup-acount-vendor'],
    () => lookupCustomerFromVendor(vendor, account),
    {
      staleTime: 0,
      cacheTime: 0,
      enabled,
    },
  );
  return queryResult;
}
