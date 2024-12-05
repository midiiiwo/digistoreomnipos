import { useMutation, useQueryClient } from 'react-query';
import { deleteMerchantWindow } from '../api/merchant';

export function useDeleteMerchantWindow(handleSuccess) {
    const client = useQueryClient();
    const queryResult = useMutation(
        ['delete-window-new'],
        payload => {
            try {
                return deleteMerchantWindow(payload);
            } catch (error) { }
        },
        {
            onSuccess(data) {
                // client.invalidateQueries('global-products');
                handleSuccess(data.data);
            },
        },
    );
    return queryResult;
}
