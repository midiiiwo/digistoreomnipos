import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Image,
  RefreshControl,
  ScrollView,
} from "react-native";
import { s } from "react-native-wind";
import { SheetManager } from "react-native-actions-sheet";
import PrimaryButton from "../components/PrimaryButton";
import Filter from "../../assets/icons/filter.svg";
import RouteFilterSheet from "../components/BottomSheets/RouteFilterSheet";
import { useSelector } from "react-redux";
import { useGetRiderDeliveryConfig } from "../hooks/useGetRiderDeliveryConfig";
import { useGetMerchantLocationDelivery } from "../hooks/useGetMerchantLocationDelivery";
import DeleteDialog from "../components/DeleteDialog";
import Bin from "../../assets/icons/delcross";
import { useNavigation } from "@react-navigation/native";
import { useDeleteMerchantRoute } from "../hooks/useDeleteMerchantRoute";
import { useToast } from "react-native-toast-notifications";
import { useQueryClient } from "react-query";
// import { useGetMerchantDistanceDelivery } from "../hooks/useGetMerchantDistanceDelivery";
import { FloatingButton } from "react-native-ui-lib";
import { useFocusEffect } from "@react-navigation/native";
import { useChangeStoreDeliveryConfig } from "../hooks/useChangeStoreDeliveryConfig";
import ManageRoutesDistance from "./ManageRoutesDistance";

const ManageRoutes = () => {
  const [filterType, setFilterType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState();
  const [activeFilter, setActiveFilter] = useState(filterType);
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const { outlet } = useSelector((state) => state.auth);
  const { data: deliveryConfig, refetch } = useGetRiderDeliveryConfig(
    user.user_merchant_id
  );
  const {
    data: dataLocation,
    refetch: refetchLocationDelivery,
    isFetchingLocation,
  } = useGetMerchantLocationDelivery(user.user_merchant_id, outlet?.outlet_id);
  // const {
  //   data: dataDistance,
  //   refetch: refetchDeliveryDistance,
  //   isFetchingDistance,
  // } = useGetMerchantDistanceDelivery(user.user_merchant_id, outlet?.outlet_id);
  const toast = useToast();
  const client = useQueryClient();
  const idToDelete = useRef();
  const { mutate } = useDeleteMerchantRoute(setDeleteStatus);
  const changeDeliveryConfig = useChangeStoreDeliveryConfig();

  // const handleRefresh = useCallback(async () => {
  //   setRefreshing(true);
  //   await refetch(); // Triggers a refetch of the data
  //   await refetchLocationDelivery();
  //   await refetchDeliveryDistance();
  //   setRefreshing(false);
  // }, [refetch, refetchLocationDelivery, refetchDeliveryDistance]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    // Refetch based on the filter type
    if (filterType === "LOCATION_BASED") {
      await refetchLocationDelivery();
    } else if (filterType === "DISTANCE_BASED") {
      await refetchDeliveryDistance();
    } else {
      await refetch(); // General refetch for other cases
    }

    setRefreshing(false);
  }, [filterType, refetch, refetchLocationDelivery]);

  useEffect(() => {
    if (deliveryConfig?.data?.code === 200) {
      const deliveryType = deliveryConfig.data.message.delivery_type;
      setFilterType(deliveryType);
      const filterName =
        deliveryType === "LOCATION_BASED"
          ? "LOCATION BASED"
          : deliveryType === "DISTANCE_BASED"
          ? "DISTANCE BASED"
          : "DIGISTORE";
      // Update the global filter state
      setActiveFilter(filterName);
    } else {
      console.error(
        "Error fetching delivery config:",
        deliveryConfig?.data?.code
      );
    }
  }, [deliveryConfig, setFilterType]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [setFilterType])
  );

  useEffect(() => {
    // console.log("location based", dataLocation?.data?.message)
    // console.log("distance based", dataDistance?.data?.message)
    if (deliveryConfig?.data?.code === 200) {
      const deliveryType = deliveryConfig.data.message.delivery_type;
      setFilterType(deliveryType);
    } else {
      console.error(
        "Error fetching delivery config:",
        deliveryConfig?.data?.code
      );
    }
  }, [deliveryConfig]);

  useEffect(() => {
    if (deleteStatus) {
      if (deleteStatus.code == 200) {
        toast.show(deleteStatus.message, { placement: "top", type: "success" });
        handleRefresh;
        client.invalidateQueries("merchant-delivery");
      } else {
        toast.show(deleteStatus.message, { placement: "top", type: "danger" });
      }
      setDeleteStatus(null);
      idToDelete.current = null;
    }
  }, [toast, deleteStatus, client]);
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [filterType])
  );
  const handleSetFilterType = async (type) => {
    const merchantId = user?.user_merchant_id;

    if (!merchantId) {
      toast.show("Merchant ID is required.", { type: "danger" });
      return;
    }

    const payload = {
      merchant: merchantId,
      delivery_type:
        type === "LOCATION BASED"
          ? "LOCATION_BASED"
          : type === "DISTANCE BASED"
          ? "DISTANCE_BASED"
          : "DIGISTORE",
    };

    try {
      const response = await changeDeliveryConfig.mutateAsync(payload);
      if (response?.code === 200) {
        setFilterType(type); // Update filter
        setActiveFilter(type); // Update active filter
        toast.show(`Delivery type changed to: ${type}`, { type: "success" });
        handleRefresh(); // Refresh the data
      } else {
        setFilterType(type); // Update filter
        setActiveFilter(type);
        handleRefresh();
        toast.show("Failed to change delivery type.", { type: "danger" });
      }
    } catch (error) {
      setFilterType(type); // Update filter
      setActiveFilter(type);
      handleRefresh();
      // console.error("Error changing delivery type:", error);
      // toast.show('Failed to change delivery type.', { type: 'danger' });
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     handleRefresh();
  //   }, [handleRefresh])
  // );

  const renderContent = () => {
    if (filterType === "LOCATION_BASED") {
      return (
        <>
          <View
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isFetchingLocation || refreshing}
                  onRefresh={handleRefresh}
                />
              }
              contentContainerStyle={{
                paddingBottom: Dimensions.get("window").height * 0.1,
                marginHorizontal: 10,
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 8,
                overflow: "hidden",
              }}
              data={dataLocation?.data?.message ?? []}
              keyExtractor={(item) => item?.user_id?.toString()}
              ListHeaderComponent={() => (
                <View style={styles.headerRow}>
                  <Text
                    style={[
                      styles.headerText,
                      { flex: 0.5, textAlign: "left" },
                    ]}
                  >
                    #
                  </Text>
                  <Text
                    style={[
                      styles.headerText,
                      { flex: 2, textAlign: "center" },
                    ]}
                  >
                    Location
                  </Text>
                  <Text
                    style={[
                      styles.headerText,
                      { flex: 1, textAlign: "center" },
                    ]}
                  >
                    Rate (GHS)
                  </Text>
                  <Text
                    style={[
                      styles.headerText,
                      { flex: 0.5, textAlign: "right" },
                    ]}
                  >
                    Actions
                  </Text>
                </View>
              )}
              renderItem={({ item, index }) => {
                if (!item) return null;
                if (
                  user.user_assigned_outlets &&
                  !user.user_assigned_outlets.includes(item.outlet_id) &&
                  user.user_merchant_group !== "Administrators"
                ) {
                  return null;
                }
                return (
                  <View style={styles.itemRow}>
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 0.5, textAlign: "left" },
                      ]}
                    >
                      {index + 1}
                    </Text>
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 2, textAlign: "center" },
                      ]}
                    >
                      {item.location}
                    </Text>
                    <Text
                      style={[
                        styles.rateText,
                        { flex: 1, textAlign: "center" },
                      ]}
                    >
                      {item.price}
                    </Text>
                    <Pressable
                      style={[
                        styles.deleteButton,
                        { flex: 0.5, alignItems: "flex-end" },
                      ]}
                      onPress={() => {
                        setVisible(true);
                        idToDelete.current = item.id;
                      }}
                    >
                      <Bin height={20} width={20} color="red" />
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        </>
      );
    } else if (filterType === "DIGISTORE") {
      return (
        <View style={styles.digistoreContainer}>
          <Image
            style={styles.digistoreImage}
            source={require("../../assets/images/food-delivery.png")}
          />
          <Text style={styles.digistoreText}>DIGISTORE DELIVERY</Text>
        </View>
      );
    } else if (filterType === "DISTANCE_BASED") {
      return (
        // <>
        //   <View
        //     style={{
        //       width: "100%",
        //       height: "100%",
        //     }}
        //   >
        //     <FlatList
        //       refreshControl={
        //         <RefreshControl
        //           refreshing={isFetchingDistance || refreshing}
        //           onRefresh={handleRefresh}
        //         />
        //       }
        //       contentContainerStyle={{
        //         paddingBottom: Dimensions.get("window").height * 0.1,
        //         marginHorizontal: 10,
        //         borderWidth: 1,
        //         borderColor: "#e0e0e0",
        //         borderRadius: 8,
        //         overflow: "hidden",
        //       }}
        //       data={dataDistance?.data?.message ?? []}
        //       keyExtractor={(item) => item?.user_id?.toString()}
        //       ListHeaderComponent={() => (
        //         <View style={styles.headerRow}>
        //           <Text
        //             style={[
        //               styles.headerText,
        //               { flex: 0.5, textAlign: "left" },
        //             ]}
        //           >
        //             #
        //           </Text>
        //           <Text
        //             style={[
        //               styles.headerText,
        //               { flex: 2, textAlign: "center" },
        //             ]}
        //           >
        //             Distance
        //           </Text>
        //           <Text
        //             style={[
        //               styles.headerText,
        //               { flex: 1, textAlign: "center" },
        //             ]}
        //           >
        //             Rate (GHS)
        //           </Text>
        //           <Text
        //             style={[
        //               styles.headerText,
        //               { flex: 0.5, textAlign: "right" },
        //             ]}
        //           >
        //             Actions
        //           </Text>
        //         </View>
        //       )}
        //       renderItem={({ item, index }) => {
        //         if (!item) return null;
        //         if (
        //           user.user_assigned_outlets &&
        //           !user.user_assigned_outlets.includes(item.outlet_id) &&
        //           user.user_merchant_group !== "Administrators"
        //         ) {
        //           return null;
        //         }
        //         return (
        //           <View style={styles.itemRow}>
        //             <Text
        //               style={[
        //                 styles.cellText,
        //                 { flex: 0.5, textAlign: "left" },
        //               ]}
        //             >
        //               {index + 1}
        //             </Text>
        //             <Text
        //               style={[
        //                 styles.cellText,
        //                 { flex: 2, textAlign: "center" },
        //               ]}
        //             >
        //               {item.start_distance}
        //               {"  "}-{"  "}
        //               {item.end_distance}
        //             </Text>
        //             <Text
        //               style={[
        //                 styles.rateText,
        //                 { flex: 1, textAlign: "center" },
        //               ]}
        //             >
        //               {item.price}
        //             </Text>
        //             <Pressable
        //               style={[
        //                 styles.deleteButton,
        //                 { flex: 0.5, alignItems: "flex-end" },
        //               ]}
        //               onPress={() => {
        //                 setVisible(true);
        //                 idToDelete.current = item.delivery_id;
        //               }}
        //             >
        //               <Bin height={20} width={20} color="red" />
        //             </Pressable>
        //           </View>
        //         );
        //       }}
        //     />
        //   </View>
        // </>
        <ManageRoutesDistance />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterButtonContainer}>
        {["LOCATION BASED", "DISTANCE BASED", "DIGISTORE"].map((type) => (
          <Pressable
            key={type}
            style={[
              styles.filterButton,
              activeFilter === type && styles.activeFilterButton,
            ]}
            onPress={() => {
              if (deliveryConfig?.data?.code === 400) {
                handleActivateDeliveries();
              } else {
                handleSetFilterType(type);
              }
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === type && styles.activeFilterButtonText,
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
      {(filterType === "LOCATION_BASED" &&
        !isFetchingLocation &&
        dataLocation?.data?.message?.length > 0) ||
      (filterType === "DISTANCE_BASED" &&
        deliveryConfig?.data?.message?.delivery_type === "DISTANCE_BASED") ? (
        <View style={styles.btnWrapper}>
          <FloatingButton
            visible={true}
            hideBackgroundOverlay
            button={{
              label: "Add Route",
              onPress: () => {
                navigation.navigate("Add Routes", { filterType });
              },
              style: {
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
                backgroundColor: "rgba(60, 121, 245, 1.0)",
                marginBottom: Dimensions.get("window").width * 0.05,
              },
            }}
          />
        </View>
      ) : null}

      <DeleteDialog
        visible={visible}
        handleCancel={() => setVisible(false)}
        handleSuccess={() => mutate({ id: idToDelete.current })}
        title="Do you want to delete this route?"
        prompt="This process is irreversible"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  contentContainer: { marginTop: 20, alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#333",
    fontSize: 15,
  },
  rateText: {
    color: "#28a745",
    fontSize: 15,
    fontWeight: "bold",
  },
  deleteButton: {
    alignItems: "center",
  },
  digistoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  digistoreImage: { height: 300, width: 300 },
  digistoreText: {
    marginTop: 30,
    fontSize: 40,
    fontWeight: "bold",
    color: "#006400",
  },
  contentText: { fontSize: 20, color: "#30475E" },
  btnWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginVertical: 24,
    marginHorizontal: 8,
  },
  btn: { backgroundColor: "#2F66F6" },
  filterButtonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  activeFilterButton: {
    backgroundColor: "rgba(25, 66, 216, 0.9)",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
});

export default ManageRoutes;
