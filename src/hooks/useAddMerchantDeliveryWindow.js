import { useMutation } from 'react-query';
import { addMerchantDeliveryWindow } from '../api/merchant';

export function useAddMerchantDeliveryWindow(handleSuccess = () => {}) {
    const queryResult = useMutation(
        payload => addMerchantDeliveryWindow(payload),
        {
            onSuccess(data) {
                handleSuccess(data?.data);
            },
            onError(error) {
                console.error("Mutation Error:", error);
            },
        },
    );
    return queryResult;
}
