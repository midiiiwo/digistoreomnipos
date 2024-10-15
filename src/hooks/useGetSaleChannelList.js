import { useQuery } from 'react-query';
import { getSaleChannelList } from '../api/quickSales';

export function useGetSaleChannelList(merchant) {
  const queryResult = useQuery(['sale-channel-list', merchant], () =>
    getSaleChannelList(merchant),
  );
  return queryResult;
}
