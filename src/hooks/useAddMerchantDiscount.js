import { useMutation } from 'react-query';
import { addMerchantDiscount } from '../api/merchant';


export function useAddMerchantDiscount(handleSuccess) {
    const queryResult = useMutation(
        ['add-merchant-discount'],
        payload => {
            try {
                return addMerchantDiscount(payload);
            } catch (error) { }
        },
        {
            onSuccess(data) {
                handleSuccess(data.data);
            },
        },
    );
    return queryResult;
}