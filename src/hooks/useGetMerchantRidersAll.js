import { useQuery } from 'react-query';
import { getMerchantRidersAll } from '../api/merchant';

export function useGetMerchantRidersAll(merchant, outlet) {
    const queryResult = useQuery(
        ['merchant-riders', merchant, outlet],
        () => getMerchantRidersAll(merchant, outlet),
        {
            staleTime: 0,
            staleTime: 600000,
            cacheTime: 0,
            refetchOnWindowFocus: true,
        } // This ensures fresh data on each request
    );

    return queryResult;
}
