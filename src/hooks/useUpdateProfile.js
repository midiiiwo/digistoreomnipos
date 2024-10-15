import { useMutation } from 'react-query';
import { updateProfile } from '../api/merchant';

export function useUpdateProfile(handleSuccess) {
  const queryResult = useMutation(
    ['update-profile'],
    payload => {
      try {
        return updateProfile(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
      onError(err) {},
    },
  );
  return queryResult;
}
