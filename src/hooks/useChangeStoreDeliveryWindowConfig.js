import { useMutation, useQueryClient } from 'react-query';
import { changeStoreDeliveryWindowConfig } from '../api/merchant'; // Update with your actual API file path

export const useChangeStoreDeliveryWindowConfig = (handleSuccess) => {
    const client = useQueryClient();

    return useMutation(
        async (payload) => {
            const response = await changeStoreDeliveryWindowConfig(payload.merchant, payload);
            return response.data; // Adjust according to your API response structure
        },
        {
            onSuccess(data) {
                console.log(data?.message); // Assuming the success message is in the 'message' property
                handleSuccess(data); // Execute the success callback
                client.invalidateQueries('delivery-config'); // Optionally invalidate queries if needed
            },
            onError(error) {
                console.error('Error changing delivery type Window:', error);
                // Optionally handle error notifications here
            }
        }
    );
};
