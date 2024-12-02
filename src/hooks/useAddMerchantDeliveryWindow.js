import { useMutation } from 'react-query';
import { addMerchantDeliveryWindow } from '../api/merchant';

export function useAddMerchantDeliveryWindow(handleSuccess) {
    const queryResult = useMutation(
        ['add-window'],
        payload => {
            try {
                return addMerchantDeliveryWindow(payload);
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
