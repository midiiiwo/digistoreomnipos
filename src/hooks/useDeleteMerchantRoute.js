import { useMutation, useQueryClient } from "react-query";
import { deleteRouteLocation } from "../api/merchant";

export function useDeleteMerchantRoute(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ["delete-route-new"],
    (payload) => {
      try {
        return deleteRouteLocation(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        // client.invalidateQueries('global-products');
        handleSuccess(data.data);
      },
    }
  );
  return queryResult;
}
