import { useQuery } from 'react-query';
import { getReceiptDetails } from '../api/merchant';

export function useGetReceiptDetails(merchant) {
  const queryResult = useQuery(
    ['get-receipt-details', merchant],
    () => getReceiptDetails(merchant),
    {},
  );
  return queryResult;
}
