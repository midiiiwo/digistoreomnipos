import { useMutation } from 'react-query';
import { createEventTicket } from '../api/tickets';

export function useCreateEventTicket(handleSuccess) {
  const queryResult = useMutation(
    ['create-event-ticket'],
    payload => {
      try {
        return createEventTicket(payload);
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
