import { useMutation } from 'react-query';
import { addSettlementDetails } from '../api/merchant';

export function useAddSettlementAccount(handleSuccess) {
  const queryResult = useMutation(
    ['add-settlement-account'],
    payload => {
      try {
        return addSettlementDetails(payload);
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
