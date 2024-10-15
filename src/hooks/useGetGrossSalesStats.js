import { useQuery } from 'react-query';
import { getGrossSalesStats } from '../api/merchant';

export function useGetGrossSalesStats(merchant, userLogin, startDate, endDate) {
  const queryResult = useQuery(['gross-sales-start', merchant, userLogin], () =>
    getGrossSalesStats(merchant, userLogin, startDate, endDate),
  );
  return queryResult;
}
