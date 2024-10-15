import { useQuery } from 'react-query';
import { getMerchantTaxes } from '../api/merchant';

export function useGetTaxes(merchant) {
  const queryResult = useQuery(['merchant-taxes', merchant], () =>
    getMerchantTaxes(merchant),
  );
  return queryResult;
}
