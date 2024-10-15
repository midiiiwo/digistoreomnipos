import { useQuery } from 'react-query';
import { serviceChargeFee } from '../api/paypoint';
import { Platform } from 'react-native';
// import { useToast } from 'react-native-toast-notifications';

export function useServiceChargeFee(vendor, amount, merchant) {
  // const toast = useToast();
  const queryResult = useQuery(
    ['service-charge', vendor, amount],
    () =>
      serviceChargeFee(
        vendor,
        amount,
        merchant,
        Platform.OS === 'android' ? 'ANDROID POS' : 'IOS]',
      ),
    {
      staleTime: 0,
      cacheTime: 0,
    },
  );
  return queryResult;
}
