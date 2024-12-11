import { useMutation, useQueryClient } from "react-query";
import { deleteRoute } from "../api/merchant";

export function useDeleteMerchantRouteDistance(handleSuccess) {
  const client = useQueryClient();
  const queryResult = useMutation(
    ["delete-route-new"],
    (payload) => {
      try {
        return deleteRoute(payload);
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
