import { useMutation } from 'react-query';
import { addMerchantRouteLocation } from '../api/merchant';

export function useAddMerchantRouteLocation(handleSuccess) {
    const queryResult = useMutation(
        ['add-route-location'],
        payload => {
            try {
                return addMerchantRouteLocation(payload);
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
