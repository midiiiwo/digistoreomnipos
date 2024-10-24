import { useMutation } from 'react-query';
import { buyTicket } from '../api/tickets';

export function useBuyTicket(handleSuccess) {
  const queryResult = useMutation(
    ['buy-ticket'],
    payload => {
      try {
        return buyTicket(payload);
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
