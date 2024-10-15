import { useQuery } from 'react-query';
import { getSelectedOrderDetails } from '../api/orders';

export function useGetSelectedOrderDetails(merchant, orderNumber) {
  const queryResult = useQuery(
    ['selected-order', merchant, orderNumber],
    () => getSelectedOrderDetails(merchant, orderNumber),
    { staleTime: 0 },
  );
  return queryResult;
}
