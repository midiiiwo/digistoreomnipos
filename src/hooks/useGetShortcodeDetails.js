import { useQuery } from 'react-query';
import { getShortcodeDetails } from '../api/merchant';

export function useGetShortcodeDetails(merchant) {
  const queryResult = useQuery(['shortcode', merchant], () =>
    getShortcodeDetails(merchant),
  );
  return queryResult;
}
