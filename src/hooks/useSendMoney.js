import { useMutation } from 'react-query';
import { sendMoney } from '../api/paypoint';

export function useSendMoney(handleSuccess) {
  const queryResult = useMutation(
    ['send-money'],
    payload => {
      try {
        return sendMoney(payload);
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
