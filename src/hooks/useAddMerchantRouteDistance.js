import { useMutation } from 'react-query';
import { addMerchantRouteDistance } from '../api/merchant';

export function useAddMerchantRouteDistance(handleSuccess) {
    const queryResult = useMutation(
        ['add-route-distance'],
        payload => {
            try {
                return addMerchantRouteDistance(payload);
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
