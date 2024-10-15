import { useMutation } from 'react-query';
import { addPersonalDetails } from '../api/merchant';

export function useAddPersonalDetails(handleSuccess) {
  const queryResult = useMutation(
    ['personal-details'],
    payload => {
      try {
        return addPersonalDetails(payload);
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
