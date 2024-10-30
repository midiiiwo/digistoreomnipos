import { useQuery } from 'react-query';
import { serviceChargeFee } from '../api/paypoint';
// import { useToast } from 'react-native-toast-notifications';

export function useServiceChargeFee(vendor, amount, merchant) {
  // const toast = useToast();
  const queryResult = useQuery(
    ['service-charge', vendor, amount],
    () => serviceChargeFee(vendor, amount, merchant, 'Digistore Business'),
    {
      staleTime: 0,
      cacheTime: 0,
    },
  );
  return queryResult;
}
