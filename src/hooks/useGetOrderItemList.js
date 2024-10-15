import { useQuery } from 'react-query';
import { getOrderItemList } from '../api/orders';

export function useGetOrderItemList(merchant, orderNumber, enabled = true) {
  const queryResult = useQuery(
    ['order-item-list', merchant, orderNumber],
    () => getOrderItemList(merchant, orderNumber),
    { staleTime: 0, enabled },
  );
  return queryResult;
}
