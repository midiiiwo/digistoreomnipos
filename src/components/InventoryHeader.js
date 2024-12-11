/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import BackIcon from "../../assets/icons/arrow-back.svg";
import { useSelector } from "react-redux";

import User from "../../assets/icons/draweruser.svg";
import CustomStatusBar from "./StatusBar";

const InventoryHeader = ({
  navigation,
  prevScreen,
  addCustomer = true,
  mainHeader,
  title,
  rightComponentText,
  rightComponentFunction,
}) => {
  const { customer } = useSelector((state) => state.sale);

  // React.useEffect(() => {
  //   StatusBar.setTranslucent(true);
  //   StatusBar.setBackgroundColor('transparent');
  // }, []);

  return (
    <View style={[styles.main, { paddingTop: 0 }, mainHeader]}>
      <CustomStatusBar backgroundColor="transparent" barStyle="dark-content" />
      {/* <StatusBar translucent={true} backgroundColor={'translucent'} /> */}
      <View style={[styles.headerMain, { paddingVertical: 14 }]}>
        <Pressable
          style={styles.back}
          onPress={() => navigation.navigate("Inventory")}
        >
          <BackIcon height={23} width={23} stroke="#000" />
        </Pressable>
        <View style={styles.titleWrapper}>
          {<Text style={[styles.prev]}>{title}</Text>}
        </View>
        {addCustomer &&
          (customer ? (
            <Pressable
              style={[
                styles.headerTextWrapper,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                },
              ]}
              onPress={() => navigation.navigate("Customer Select")}
            >
              <User height={20} width={20} fill="#1942D8" />
              <Text
                numberOfLines={1}
                style={[
                  styles.headerText,
                  { marginLeft: 3, maxWidth: "84%", textAlign: "right" },
                ]}
              >
                {customer.customer_name}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.headerTextWrapper}
              onPress={() => navigation.navigate("Customer Select")}
            >
              <Text style={styles.headerText}>Add Customer</Text>
            </Pressable>
          ))}
        {rightComponentText && rightComponentText.length > 0 ? (
          <Pressable
            style={styles.headerTextWrapper}
            onPress={() => rightComponentFunction()}
          >
            <Text style={styles.headerText}>{rightComponentText}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: 12,
    // justifyContent: 'center',
    backgroundColor: "#fff",
  },
  headerMain: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 22,
    // paddingTop: 30,
    // paddingBottom: 8,
    paddingLeft: 12,
    // height: Dimensions.get('window').height * 0.08,
    // justifyContent: 'center'
  },

  headerText: {
    marginLeft: "auto",
    marginRight: 14,
    color: "#1942D8",
    fontFamily: "Inter-Medium",
    fontSize: 15,
  },
  headerTextWrapper: {
    marginLeft: "auto",
    padding: 6,
    position: "absolute",
    right: 7,
  },
  titleWrapper: {
    flexDirection: "row",
    textAlign: "center",
    marginRight: "auto",
    marginLeft: "auto",
    // right: 'auto',
  },
  prev: {
    fontFamily: "ReadexPro-Medium",
    fontSize: 17.5,
    color: "#000",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    // marginRight: 'auto',
    position: "absolute",
    padding: 12,
    left: 15,
  },
});

export default InventoryHeader;
