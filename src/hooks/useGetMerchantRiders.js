import { useQuery } from 'react-query';
import { getMerchantRiders } from '../api/merchant';

export function useGetMerchantRiders(merchant, outlet) {
  const queryResult = useQuery(['merchant-riders', merchant, outlet], () =>
    getMerchantRiders(merchant, outlet),
  );
  return queryResult;
}
