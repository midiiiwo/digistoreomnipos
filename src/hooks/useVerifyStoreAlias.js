import { useQuery } from 'react-query';
import { verifyStoreAlias } from '../api/merchant';

export function useVerifyStoreAlias(storeAlias, onSuccess, enabled = false) {
  const queryResult = useQuery(
    ['verify-store-alias', storeAlias],
    () => verifyStoreAlias(storeAlias),
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
