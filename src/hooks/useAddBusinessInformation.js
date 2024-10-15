import { useMutation } from 'react-query';
import { addBusinessDetails } from '../api/merchant';

export function useAddBusinessInformation(handleSuccess) {
  const queryResult = useMutation(
    ['business-information'],
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
