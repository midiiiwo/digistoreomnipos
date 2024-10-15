import { useQuery } from 'react-query';
import { verifyMerchantUserUsername } from '../api/merchant';

export function useVerifyMerchantUserUsername(
  username,
  onSuccess,
  enabled = false,
) {
  const queryResult = useQuery(
    ['verify-merchant-user-username', username],
    () => verifyMerchantUserUsername(username),
    {
      enabled,
      onSuccess: d => {
        console.log(d);
        onSuccess(d.data);
      },
    },
  );
  return queryResult;
}
