import { useQuery } from 'react-query';
import { getInvoiceHistory } from '../api/merchant';

export function useGetInvoiceHistory(merchant, startDate, endDate) {
  const queryResult = useQuery(['invoice-history', merchant], () =>
    getInvoiceHistory(merchant, startDate, endDate),
  );
  return queryResult;
}
