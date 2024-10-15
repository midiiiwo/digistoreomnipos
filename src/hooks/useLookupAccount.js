import { useQuery } from 'react-query';
import { lookupAccount } from '../api/sales';
// import { useToast } from 'react-native-toast-notifications';

export function useLookupAccount(network, number, enabled = true) {
  // const toast = useToast();
  const queryResult = useQuery(
    ['lookup-acount'],
    () => lookupAccount(network, number),
    {
      staleTime: 0,
      cacheTime: 0,
      enabled,
    },
  );
  return queryResult;
}
