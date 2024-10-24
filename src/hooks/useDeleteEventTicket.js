import { useMutation } from 'react-query';
import { deleteEventTicket } from '../api/tickets';

export function useDeleteEventTicket(handleSuccess) {
  const queryResult = useMutation(
    ['delete-event-ticket'],
    payload => {
      try {
        return deleteEventTicket(payload);
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
