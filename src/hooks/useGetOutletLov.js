import { useQuery } from 'react-query';
import { getOutletsLov } from '../api/orders';

export function useGetOutletLov(merchant, enabled = false) {
  const queryResult = useQuery(
    ['outlet-lov', merchant],
    () => getOutletsLov(merchant),
    { enabled },
  );
  return queryResult;
}
