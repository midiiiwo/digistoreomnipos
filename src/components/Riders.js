import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGetMerchantRidersAll } from "../hooks/useGetMerchantRidersAll";
import Bin from "../../assets/icons/delcross";
import DeleteDialog from "../components/DeleteDialog";
import { useDeleteRider } from "../hooks/useDeleteRider";
import { useToast } from "react-native-toast-notifications";
import { useQueryClient } from "react-query";
import { FloatingButton } from "react-native-ui-lib";

function Riders() {
  const { user, outlet } = useSelector((state) => state.auth);
  const { data, refetch, isFetching } = useGetMerchantRidersAll(
    user.user_merchant_id,
    outlet.outlet_id
  );
  const [visible, setVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState();
  const navigation = useNavigation();
  const { mutate } = useDeleteRider(setDeleteStatus);
  const toast = useToast();
  const client = useQueryClient();
  const idToDelete = useRef();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (deleteStatus) {
      if (deleteStatus.code === 200) {
        toast.show(deleteStatus.message, { placement: "top", type: "success" });
        client.invalidateQueries("merchant-riders");
        refetch();
      } else {
        toast.show(deleteStatus.message, { placement: "top", type: "danger" });
      }
      setDeleteStatus(null);
      idToDelete.current = null;
    }
  }, [toast, deleteStatus, client]);

  return (
    <View style={styles.main}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          paddingBottom: Dimensions.get("window").height * 0.1,
          marginHorizontal: 10,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          borderRadius: 8,
          overflow: "hidden",
        }}
        data={data?.data?.message}
        keyExtractor={(item) => item?.user_id?.toString()}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, { flex: 0.5, textAlign: "left" }]}>
              #
            </Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>
              Name
            </Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>
              Number
            </Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>
              Vehicle
            </Text>
            <Text
              style={[styles.headerText, { flex: 0.5, textAlign: "right" }]}
            >
              Actions
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          if (!item) return null;

          return (
            <View style={styles.itemContainer}>
              <Text style={[styles.cellText, { flex: 0.5, textAlign: "left" }]}>
                {index + 1}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
                {item.name}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
                {item.telephone}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
                {item.vehicle}
              </Text>

              <Pressable
                style={[
                  styles.deleteButton,
                  { flex: 0.5, alignItems: "flex-end" },
                ]}
                onPress={() => {
                  setVisible(true);
                  idToDelete.current = item.user_id;
                }}
              >
                <Bin height={20} width={20} />
              </Pressable>
            </View>
          );
        }}
      />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* <PrimaryButton style={styles.btn} handlePress={() => navigation.navigate('Add Rider')}>
                    Add Rider
                </PrimaryButton> */}
        <FloatingButton
          visible={true}
          hideBackgroundOverlay
          // bottomMargin={Dimensions.get('window').width * 0.18}

          button={{
            label: "Add Rider",
            onPress: () => {
              navigation.navigate("Add Rider");
            },

            style: {
              // marginLeft: 'auto',
              // marginRight: 14,
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              backgroundColor: "rgba(60, 121, 245, 1.0)",
              marginBottom: Dimensions.get("window").width * 0.05,
            },
          }}
        />
      </View>

      <DeleteDialog
        visible={visible}
        handleCancel={() => setVisible(false)}
        handleSuccess={() => mutate({ user_id: idToDelete.current })}
        title="Do you want to delete this rider?"
        prompt="This process is irreversible"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: 10, paddingTop: 16 },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b2b34",
    marginBottom: 10,
  },
  channelText: {
    fontSize: 16,
    color: "#1b2b34",
    fontFamily: "ReadexPro-Medium",
  },
  address: { color: "#304753", fontSize: 14 },
  btn: {
    backgroundColor: rgb(47, 102, 246, 0.5),
    width: 500,
    borderRadius: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  btnWrapper: {
    marginVertical: 24,
    marginHorizontal: 8,
    marginTop: "auto",
  },
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

export default Riders;
