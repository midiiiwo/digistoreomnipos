import { useMutation } from 'react-query';
import { getReportSummaryV2 } from '../api/merchant';

export function useGetSummaryV2(handleSuccess) {
  const queryResult = useMutation(
    ['summary-insights-v2'],
    payload => {
      try {
        return getReportSummaryV2(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}
