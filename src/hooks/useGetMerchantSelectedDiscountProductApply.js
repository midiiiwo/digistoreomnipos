import { useQuery } from 'react-query';
import { getMerchantSelectedDiscountProductApply } from '../api/merchant';

export function useMerchantSelectedDiscountProductApply(merchant, discount_id) {
    const queryResult = useQuery(['merchant-selected-product-discount-details', merchant, discount_id], () =>
        getMerchantSelectedDiscountProductApply(merchant, discount_id),
    );
    return queryResult;
}