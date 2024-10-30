import { useQuery } from 'react-query';
import { getOutletProducts } from '../api/sales';

export function useGetOutletProducts(merchant, outlet) {
  const queryResult = useQuery(['outlet-products', merchant, outlet], () =>
    getOutletProducts(merchant, outlet),
  );
  return queryResult;
}
