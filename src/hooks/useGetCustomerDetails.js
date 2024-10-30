import { useQuery } from 'react-query';
import { getCustomerDetails } from '../api/merchant';

export function useGetCustomerDetails(merchant, customerId) {
  const queryResult = useQuery(['customer-details', merchant, customerId], () =>
    getCustomerDetails(merchant, customerId),
  );
  return queryResult;
}
