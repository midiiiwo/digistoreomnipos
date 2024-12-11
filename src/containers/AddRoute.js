// import React, { useState, useReducer, useEffect } from 'react';
// import { StyleSheet, View, ScrollView, Text } from 'react-native';
// import { useAddMerchantRouteLocation } from '../hooks/useAddMerchantRouteLocation';
// import { useAddMerchantRouteDistance } from '../hooks/useAddMerchantRouteDistance';
// import { useSelector } from 'react-redux';
// import PrimaryButton from '../components/PrimaryButton';
// import { useToast } from 'react-native-toast-notifications';
// import { useQueryClient } from 'react-query';
// import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
// import Input from '../components/Input';
// import { s } from 'react-native-wind';

// import { SelectList } from 'react-native-dropdown-select-list';

// const reducer = (state, action) => {
//     switch (action.type) {
//         case 'location':
//         case 'price':
//         case 'start':
//         case 'end':
//             return { ...state, [action.type]: action.payload };
//         default:
//             return state;
//     }
// };

// const AddRoutes = ({ route, navigation }) => {
//     const { filterType } = route.params;
//     const { user } = useSelector(state => state.auth);
//     const { data, refetch, isFetching } = useGetMerchantOutlets(user.user_merchant_id);
//     const [saved, setSaved] = useState();
//     const [showError, setShowError] = useState(false);
//     const [routes, setRoutes] = useState([{ location: '', price: '' }]);
//     const [routesDistance, setRoutesDistance] = useState([{ start: '', end: '', price: '' }]);
//     const [selectedOutlet, setSelectedOutlet] = useState(null);
//     const toast = useToast();
//     const client = useQueryClient();

//     const addRoutesLocation = useAddMerchantRouteLocation((response) => {
//         if (response?.status === 0) {
//             client.invalidateQueries('add-route-location');
//         }
//         setSaved(response);
//     });

//     const addRoutesDistance = useAddMerchantRouteDistance((response) => {
//         console.log('Response from addRoutesDistance:', response);
//         if (response?.status === 0) {
//             client.invalidateQueries('add-route-distance');
//         }
//         setSaved(response);
//     });

//     const outletData = data?.data?.data || [];
//     const dataOutlet = [
//         { value: "Select All", key: "all" },
//         ...outletData
//             .filter(outlet => outlet !== null)
//             .map(outlet => ({ value: outlet.outlet_name, key: outlet.outlet_id })),
//     ];

//     useEffect(() => {
//         if (saved) {
//             toast.show(saved.message, { placement: 'top', type: saved.code === 200 ? 'success' : 'danger' });
//             if (saved.code === 200) navigation.goBack();
//             setSaved(null);
//         }
//     }, [saved, toast, navigation]);

//     const handleAddRoute = () => {
//         setRoutes([...routes, { location: '', price: '' }]);
//     };

//     const handleAddRouteDistance = () => {
//         setRoutesDistance([...routesDistance, { start: '', end: '', price: '' }]);
//     };

//     const handleRemoveRoute = (index, isDistanceBased) => {
//         if (isDistanceBased) {
//             setRoutesDistance(routesDistance.filter((_, i) => i !== index));
//         } else {
//             setRoutes(routes.filter((_, i) => i !== index));
//         }
//     };

//     const handleRouteChange = (index, field, value, isDistanceBased) => {
//         const newRoutes = isDistanceBased ? [...routesDistance] : [...routes];
//         newRoutes[index][field] = value;
//         isDistanceBased ? setRoutesDistance(newRoutes) : setRoutes(newRoutes);
//     };

//     const validateRoutes = (routesArray, fields) => {
//         return routesArray.every(route => fields.every(field => route[field]));
//     };

//     const handleSaveRoutes = async (isDistanceBased) => {
//         if (!selectedOutlet) {
//             setShowError(true);
//             toast.show('Please select an outlet.', { placement: 'top', type: 'danger' });
//             return;
//         }

//         const outletIds = selectedOutlet.key === "all"
//             ? dataOutlet.filter(outlet => outlet.key !== "all").map(outlet => outlet.key)
//             : [selectedOutlet.key];

//         const routesArray = isDistanceBased ? routesDistance : routes;
//         const requiredFields = isDistanceBased ? ['start', 'end', 'price'] : ['location', 'price'];

//         if (!validateRoutes(routesArray, requiredFields)) {
//             setShowError(true);
//             toast.show('Please fill out all fields for each route.', { placement: 'top', type: 'danger' });
//             return;
//         }

//         const formatDistance = (value) => {
//             if (!value.endsWith(' Km')) {
//                 return `${value.trim()} Km`;
//             }
//             return value.trim();
//         };

//         // To avoid multiple toasts, set a flag to track when routes have been added
//         let success = true;
//         let errorMessage = '';

//         try {
//             // If "Select All" is selected, iterate over each outlet and add routes
//             if (selectedOutlet.key === "all") {
//                 for (const outletId of outletIds) {
//                     for (const route of routesArray) {
//                         const payload = isDistanceBased
//                             ? { start_distance: formatDistance(route.start), end_distance: formatDistance(route.end), price: route.price, outlet_id: outletId, merchant_id: user.user_merchant_id }
//                             : { location: route.location, price: route.price, outlet_id: outletId, merchant_id: user.user_merchant_id };

//                         const response = await (isDistanceBased ? addRoutesDistance : addRoutesLocation).mutateAsync(payload);
//                         if (response?.status !== 0) {
//                             success = false;
//                             errorMessage = `Error adding route for outlet ${outletId}: ${response?.message}`;
//                             break; // Exit loop if error occurs
//                         }
//                     }
//                     if (!success) break; // Exit outer loop if error occurred
//                 }
//             } else {
//                 // For single outlet selection, add route directly
//                 for (const route of routesArray) {
//                     const payload = isDistanceBased
//                         ? { start_distance: formatDistance(route.start), end_distance: formatDistance(route.end), price: route.price, outlet_id: outletIds, merchant_id: user.user_merchant_id }
//                         : { location: route.location, price: route.price, outlet_id: outletIds, merchant_id: user.user_merchant_id };

//                     const response = await (isDistanceBased ? addRoutesDistance : addRoutesLocation).mutateAsync(payload);
//                     if (response?.status !== 0) {
//                         success = false;
//                         errorMessage = `Error adding route: ${response?.message}`;
//                         break;
//                     }
//                 }
//             }

//             if (success) {
//                 toast.show('Routes added successfully.', { placement: 'top', type: 'success' });
//                 navigation.goBack();
//             } else {
//                 toast.show(errorMessage, { placement: 'top', type: 'danger' });
//             }

//         } catch (err) {
//             toast.show(`Error adding route: ${err.message}`, { placement: 'top', type: 'danger' });
//         }
//     };

//     return (
//         <View style={{ flex: 1, backgroundColor: '#fff' }}>
//             <ScrollView style={styles.main}>
//                 <SelectList
//                     setSelected={(key) => setSelectedOutlet(dataOutlet.find(outlet => outlet.key === key))}
//                     data={dataOutlet}
//                     save="key"
//                 />

//                 {(filterType === 'DISTANCE_BASED' ? routesDistance : routes).map((route, index) => (
//                     <View key={index} style={s`flex-row items-center justify-between mt-4`}>
//                         {filterType === 'DISTANCE_BASED' ? (
//                             <>
//                                 <Input
//                                     style={s`flex-1 mr-2`}
//                                     placeholder="Enter Start (km)"
//                                     showError={showError && !route.start}
//                                     val={route.start}
//                                     setVal={text => handleRouteChange(index, 'start', text, true)}
//                                 />
//                                 <Input
//                                     style={s`flex-1 mr-2`}
//                                     placeholder="Enter End (km)"
//                                     showError={showError && !route.end}
//                                     val={route.end}
//                                     setVal={text => handleRouteChange(index, 'end', text, true)}
//                                 />
//                             </>
//                         ) : (
//                             <Input
//                                 style={s`flex-1 mr-2`}
//                                 placeholder="Enter Location"
//                                 showError={showError && !route.location}
//                                 val={route.location}
//                                 setVal={text => handleRouteChange(index, 'location', text, false)}
//                             />
//                         )}
//                         <Input
//                             style={s`flex-1 ml-2`}
//                             placeholder="Price"
//                             showError={showError && !route.price}
//                             val={route.price}
//                             setVal={text => handleRouteChange(index, 'price', text, filterType === 'DISTANCE_BASED')}
//                             keyboardType="numeric"
//                         />
//
//                     </View>
//                 ))}
//             </ScrollView>
//             <View style={styles.btnWrapper}>
//                 <PrimaryButton
//                     style={styles.btn}
//                     handlePress={() => handleSaveRoutes(filterType === 'DISTANCE_BASED')}
//                 >
//                     <Text>Save Routes</Text>
//                 </PrimaryButton>
//             </View>
//         </View>
//     );
// };

// export default AddRoutes;

// const styles = StyleSheet.create({
//     main: {
//         paddingHorizontal: 26,
//         marginBottom: 78,
//         marginTop: 26,
//     },
//     btnWrapper: {
//         position: 'absolute',
//         bottom: 0,
//         alignItems: 'center',
//         width: '100%',
//         backgroundColor: '#fff',
//         paddingVertical: 12,
//         borderTopColor: '#ddd',
//         borderTopWidth: 0.6,
//     },
//     btn: {
//         borderRadius: 4,
//         width: '90%',
//     },
// });

import React, { useState, useReducer, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useAddMerchantRouteLocation } from "../hooks/useAddMerchantRouteLocation";
import { useAddMerchantRouteDistance } from "../hooks/useAddMerchantRouteDistance";
import { useSelector } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import Icon from "react-native-vector-icons/AntDesign";
import { useToast } from "react-native-toast-notifications";
import { useQueryClient } from "react-query";
import { useGetMerchantOutlets } from "../hooks/useGetMerchantOutlets";
import Input from "../components/Input";
import { SelectList } from "react-native-dropdown-select-list";

const reducer = (state, action) => {
  switch (action.type) {
    case "location":
    case "price":
    case "start":
    case "end":
      return { ...state, [action.type]: action.payload };
    default:
      return state;
  }
};

const AddRoutes = ({ route, navigation }) => {
  const { filterType } = route.params;
  const { user } = useSelector((state) => state.auth);
  const { data, refetch, isFetching } = useGetMerchantOutlets(
    user.user_merchant_id
  );
  const [saved, setSaved] = useState();
  const [showError, setShowError] = useState(false);
  const [routes, setRoutes] = useState([{ location: "", price: "" }]);
  const [routesDistance, setRoutesDistance] = useState([
    { start: "", end: "", price: "" },
  ]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const toast = useToast();
  const client = useQueryClient();

  const addRoutesLocation = useAddMerchantRouteLocation((response) => {
    if (response?.status === 0) {
      client.invalidateQueries("add-route-location");
    }
    setSaved(response);
  });

  const addRoutesDistance = useAddMerchantRouteDistance((response) => {
    console.log("Response from addRoutesDistance:", response);
    if (response?.status === 0) {
      client.invalidateQueries("add-route-distance");
    }
    setSaved(response);
  });

  const outletData = data?.data?.data || [];
  const dataOutlet = [
    { value: "Select All", key: "all" },
    ...outletData
      .filter((outlet) => outlet !== null)
      .map((outlet) => ({ value: outlet.outlet_name, key: outlet.outlet_id })),
  ];

  useEffect(() => {
    if (saved) {
      toast.show(saved.message, {
        placement: "top",
        type: saved.code === 200 ? "success" : "danger",
      });
      if (saved.code === 200) navigation.goBack();
      setSaved(null);
    }
  }, [saved, toast, navigation]);

  const handleAddRoute = () => {
    setRoutes([...routes, { location: "", price: "" }]);
  };

  const handleAddRouteDistance = () => {
    setRoutesDistance([...routesDistance, { start: "", end: "", price: "" }]);
  };

  const handleRemoveRoute = (index, isDistanceBased) => {
    if (isDistanceBased) {
      setRoutesDistance(routesDistance.filter((_, i) => i !== index));
    } else {
      setRoutes(routes.filter((_, i) => i !== index));
    }
  };

  const handleRouteChange = (index, field, value, isDistanceBased) => {
    const newRoutes = isDistanceBased ? [...routesDistance] : [...routes];
    newRoutes[index][field] = value;
    isDistanceBased ? setRoutesDistance(newRoutes) : setRoutes(newRoutes);
  };

  const validateRoutes = (routesArray, fields) => {
    return routesArray.every((route) => fields.every((field) => route[field]));
  };

  const handleSaveRoutes = async (isDistanceBased) => {
    if (!selectedOutlet) {
      setShowError(true);
      toast.show("Please select an outlet.", {
        placement: "top",
        type: "danger",
      });
      return;
    }

    const outletIds =
      selectedOutlet.key === "all"
        ? dataOutlet
            .filter((outlet) => outlet.key !== "all")
            .map((outlet) => outlet.key)
        : [selectedOutlet.key];

    const routesArray = isDistanceBased ? routesDistance : routes;
    const requiredFields = isDistanceBased
      ? ["start", "end", "price"]
      : ["location", "price"];

    if (!validateRoutes(routesArray, requiredFields)) {
      setShowError(true);
      toast.show("Please fill out all fields for each route.", {
        placement: "top",
        type: "danger",
      });
      return;
    }

    const formatDistance = (value) => {
      if (!value.endsWith(" Km")) {
        return `${value.trim()} Km`;
      }
      return value.trim();
    };

    // Prepare all API calls
    const promises = [];
    for (const outletId of outletIds) {
      for (const route of routesArray) {
        const payload = isDistanceBased
          ? {
              start_distance: formatDistance(route.start),
              end_distance: formatDistance(route.end),
              price: route.price,
              outlet_id: outletId,
              merchant_id: user.user_merchant_id,
            }
          : {
              location: route.location,
              price: route.price,
              outlet_id: outletId,
              merchant_id: user.user_merchant_id,
            };

        const apiCall = isDistanceBased
          ? addRoutesDistance.mutateAsync(payload)
          : addRoutesLocation.mutateAsync(payload);

        promises.push(apiCall);
      }
    }

    try {
      const results = await Promise.all(promises);

      // Check for failed requests
      const failedRequests = results.filter((res) => res?.status !== 200);
      if (failedRequests.length > 0) {
        toast.show(
          `Some routes could not be added. Check your data and try again.`,
          {
            placement: "top",
            type: "danger",
          }
        );
        // console.log(failedRequests, "nomber")
      } else {
        // toast.show('Routes added successfully.', { placement: 'top', type: 'success' });
        // navigation.goBack();
        console.log("wow");
      }
    } catch (err) {
      toast.show(`An error occurred: ${err.message}`, {
        placement: "top",
        type: "danger",
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.main}>
        <SelectList
          setSelected={(key) =>
            setSelectedOutlet(dataOutlet.find((outlet) => outlet.key === key))
          }
          data={dataOutlet}
          save="key"
        />

        {(filterType === "DISTANCE_BASED" ? routesDistance : routes).map(
          (route, index) => (
            <View key={index} style={styles.routeContainer}>
              {filterType === "DISTANCE_BASED" ? (
                <>
                  <Input
                    style={styles.inputDistance}
                    placeholder="Enter Start (km)"
                    showError={showError && !route.start}
                    val={route.start}
                    setVal={(text) =>
                      handleRouteChange(index, "start", text, true)
                    }
                  />
                  <Input
                    style={styles.inputDistance}
                    placeholder="Enter End (km)"
                    showError={showError && !route.end}
                    val={route.end}
                    setVal={(text) =>
                      handleRouteChange(index, "end", text, true)
                    }
                  />
                </>
              ) : (
                <Input
                  style={styles.input}
                  placeholder="Enter Location"
                  showError={showError && !route.location}
                  val={route.location}
                  setVal={(text) =>
                    handleRouteChange(index, "location", text, false)
                  }
                />
              )}
              <Input
                style={[
                  styles.inputPrice,
                  { width: filterType === "DISTANCE_BASED" ? "30%" : "45%" },
                ]}
                placeholder="Price"
                showError={showError && !route.price}
                val={route.price}
                setVal={(text) =>
                  handleRouteChange(
                    index,
                    "price",
                    text,
                    filterType === "DISTANCE_BASED"
                  )
                }
                keyboardType="numeric"
              />
              <View style={styles.buttonContainer}>
                <Icon
                  name="delete"
                  size={40}
                  color="#900"
                  onPress={() =>
                    handleRemoveRoute(index, filterType === "DISTANCE_BASED")
                  }
                />
                <View style={{ marginRight: 15 }} />
                <Icon
                  name="pluscircleo"
                  size={40}
                  color="rgba(25, 66, 216, 0.9)"
                  onPress={
                    filterType === "DISTANCE_BASED"
                      ? handleAddRouteDistance
                      : handleAddRoute
                  }
                />
              </View>
            </View>
          )
        )}
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => handleSaveRoutes(filterType === "DISTANCE_BASED")}
        >
          <Text>Save Routes</Text>
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddRoutes;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 26,
    marginBottom: 78,
    flex: 1,
  },
  routeContainer: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  input: {
    marginBottom: 10,
    width: "45%",
  },
  inputPrice: {
    marginBottom: 10,
  },
  inputDistance: {
    marginBottom: 10,
    width: "30%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deleteButton: {
    color: "red",
    textDecorationLine: "underline",
  },
  addButton: {
    color: "blue",
    textDecorationLine: "underline",
  },
  btnWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  btn: {
    paddingVertical: 12,
    width: "80%",
  },
});
