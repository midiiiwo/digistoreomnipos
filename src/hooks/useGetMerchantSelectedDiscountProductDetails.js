import { useQuery } from 'react-query';
import { getMerchantSelectedDiscountProductDetails } from '../api/merchant';

export function useGetMerchantSelectedProductDiscountDetails(merchant) {
    const queryResult = useQuery(['merchant-selected-product-discount-details', merchant], () =>
        getMerchantSelectedDiscountProductDetails(merchant),
    );
    return queryResult;
}