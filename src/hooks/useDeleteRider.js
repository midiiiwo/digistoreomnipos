import { useMutation, useQueryClient } from 'react-query';
import { deleteRider } from '../api/merchant';

export function useDeleteRider(handleSuccess) {
    const client = useQueryClient();
    const queryResult = useMutation(
        ['delete-product'],
        payload => {
            try {
                return deleteRider(payload);
            } catch (error) { }
        },
        {
            onSuccess(data) {
                console.log(data.data);
                handleSuccess(data.data);
            },
        },
    );
    return queryResult;
}
