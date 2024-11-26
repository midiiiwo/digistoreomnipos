import { useQuery } from 'react-query';
import { getMerchantDiscountDetails } from '../api/merchant';

export function useGetMerchantDiscountDetails(merchant) {
    const queryResult = useQuery(['merchant-discount-details', merchant], () =>
        getMerchantDiscountDetails(merchant),
    );
    return queryResult;
}
