import { useMutation } from 'react-query';
import { deleteMerchantDiscount } from '../api/merchant';

export function useDeleteMerchantDiscount(handleSuccess) {
    const queryResult = useMutation(
        ['delete-merchant-discount'],
        ({ discount_id, mod_by }) => {
            try {
                return deleteMerchantDiscount(discount_id, mod_by);
            } catch (error) {
                console.error('Error deleting merchant discount:', error);
                throw error; // Ensure the error is propagated
            }
        },
        {
            onSuccess(data) {
                handleSuccess(data.data);
            },
            onError(error) {
                // Optional: handle side effects for errors, like showing a notification
                console.error('Mutation failed:', error);
            },
        },
    );
    return queryResult;
}
