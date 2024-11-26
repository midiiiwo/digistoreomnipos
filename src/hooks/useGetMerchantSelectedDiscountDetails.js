import { useQuery } from 'react-query';
import { getMerchantSelectedDiscountDetails } from '../api/merchant';

export function useGetMerchantSelectedDiscountDetails(discount_id) {
    const queryResult = useQuery(['selected-discount-details', discount_id], () =>
        getMerchantSelectedDiscountDetails(discount_id),
    );
    return queryResult;
}
