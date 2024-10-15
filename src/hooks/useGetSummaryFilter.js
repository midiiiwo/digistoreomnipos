import { useQuery } from 'react-query';
import { getReportSummary } from '../api/merchant';

export function useGetSummaryFilter(
  merchant,
  userLogin,
  startDate,
  endDate,
  enabled,
) {
  const queryResult = useQuery(
    ['summary-filter', startDate, endDate],
    () => getReportSummary(merchant, userLogin, startDate, endDate),
    { staleTime: 0, cacheTime: 0, enabled },
  );
  return queryResult;
}
