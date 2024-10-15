import { useMutation } from 'react-query';
import { mapMerchantOutletsToUser } from '../api/merchant';

export function useMapMerchantOutletsToUser(handleSuccess) {
  const queryResult = useMutation(
    ['map-outlets-to-user'],
    payload => {
      try {
        return mapMerchantOutletsToUser(payload);
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
