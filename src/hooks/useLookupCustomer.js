import { useQuery } from 'react-query';
import { getLookupCustomer } from '../api/merchant';
// import { useToast } from 'react-native-toast-notifications';

export function useLookupCustomer(search_value, enabled = false) {
  // const toast = useToast();
  const queryResult = useQuery(
    ['lookup-customer'],
    () => getLookupCustomer(search_value),
    {
      staleTime: 0,
      cacheTime: 0,
      enabled,
    },
  );
  return queryResult;
}
