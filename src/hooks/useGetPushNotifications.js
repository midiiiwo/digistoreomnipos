import { useQuery } from 'react-query';
import { getPushNotifications } from '../api/merchant';

export function useGetPushNotifications() {
  const queryResult = useQuery(['push-notifications'], () =>
    getPushNotifications(),
  );
  return queryResult;
}
