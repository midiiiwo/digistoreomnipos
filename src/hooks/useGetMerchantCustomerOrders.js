import { useQuery } from 'react-query';
import { getMerchantCustomerOrders } from '../api/merchant';

export function useGetMerchantCustomerOrders(
  merchant,
  customerPhone,
  startDate,
  endDate,
) {
  const queryResult = useQuery(
    ['merchant-customer-orders', merchant, customerPhone, startDate, endDate],
    () =>
      getMerchantCustomerOrders(merchant, customerPhone, startDate, endDate),
  );
  return queryResult;
}
