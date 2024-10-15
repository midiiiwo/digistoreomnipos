import { useQuery } from 'react-query';
import { getMerchantRiders } from '../api/merchant';

export function useGetMerchantRiders(merchant) {
    const queryResult = useQuery(
        ['merchant-riders', merchant],
        () => getMerchantRiders(merchant),
    );
    return queryResult;
}
