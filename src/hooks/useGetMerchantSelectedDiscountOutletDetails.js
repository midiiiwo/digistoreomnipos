import { useQuery } from 'react-query';
import { getMerchantSelectedDiscountOutletDetails } from '../api/merchant';

export function useGetMerchantSelectedOutletDiscountDetails(merchant, discount_id) {
    const queryResult = useQuery(['merchant-selected-outlet-discount-details', merchant, discount_id], () =>
        getMerchantSelectedDiscountOutletDetails(merchant, discount_id),
    );
    return queryResult;
}