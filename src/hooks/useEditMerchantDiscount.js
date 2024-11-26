// import { useMutation } from 'react-query';
// import { editMerchantDiscount } from '../api/merchant';

// export function useEditMerchantDiscount(handleSuccess) {
//     const queryResult = useMutation(
//         ['edit-merchant-discount'],
//         payload => {
//             try {
//                 return editMerchantDiscount(payload);
//             } catch (error) { }
//         },
//         {
//             onSuccess(data) {
//                 handleSuccess(data.data);
//             },
//         },
//     );
//     return queryResult;
// }
import { useMutation } from 'react-query';
import { editMerchantDiscount } from '../api/merchant';

export function useEditMerchantDiscount(handleSuccess) {
    const mutation = useMutation(
        (payload) => {
            // Ensure the API call is made to edit the discount
            return editMerchantDiscount(payload);
        },
        {
            onSuccess(data) {
                // Call the success handler with the returned data
                if (handleSuccess) {
                    handleSuccess(data.data);
                }
            },
            onError(error) {
                // Handle error (optional: you can log it or show a toast)
                console.error("Error editing merchant discount:", error);
            },
        }
    );

    return mutation;
}