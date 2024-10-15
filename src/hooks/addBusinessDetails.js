import { useMutation } from 'react-query';
import { addBusinessDetails } from '../api/merchant';

export function useAddBusinessDetails(handleSuccess) {
  const queryResult = useMutation(
    ['business-details'],
    payload => {
      try {
        return addBusinessDetails(payload);
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
