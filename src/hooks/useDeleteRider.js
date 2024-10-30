import { useMutation, useQueryClient } from 'react-query';
import { deleteRider } from '../api/merchant';

export function useDeleteRider(handleSuccess) {
    const client = useQueryClient();
    const queryResult = useMutation(
        ['delete-rider'],
        async (payload) => {
            try {
                return await deleteRider(payload);
            } catch (error) {
                console.error('Delete rider error:', error);
                throw error;
            }
        },
        {
            onSuccess(data) {
                console.log(data?.data?.message);
                handleSuccess(data?.data);
            },
        },
    );
    return queryResult;
}