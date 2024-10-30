import { useQuery } from 'react-query';
import { getTodoList } from '../api/merchant';

export function useTodoList(merchant) {
  const queryResult = useQuery(['todo-list', merchant], () =>
    getTodoList(merchant),
  );
  return queryResult;
}
