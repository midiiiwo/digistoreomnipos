import { useMutation } from 'react-query';
import { editEventTicket } from '../api/tickets';

export function useEditEventTicket(handleSuccess) {
  const queryResult = useMutation(
    ['edit-event-ticket'],
    payload => {
      try {
        return editEventTicket(payload);
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
