import { useQuery } from 'react-query';
import { getApplicableTaxes } from '../api/sales';

export function useGetApplicableTaxes(merchant, enabled) {
  const queryResult = useQuery(
    ['applicable-taxes', merchant],
    () => getApplicableTaxes(merchant),
    { staleTime: 0 },
  );
  return queryResult;
}
