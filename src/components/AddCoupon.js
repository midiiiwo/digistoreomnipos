
import React from "react";
import { StyleSheet, View, ScrollView, Text, FlatList, Pressable } from "react-native";
import { Checkbox, RadioButton, RadioGroup } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import Loading from "../components/Loading";
import { useToast } from "react-native-toast-notifications";
import { useQueryClient } from "react-query";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "../components/Input";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useAddMerchantDiscount } from "../hooks/useAddMerchantDiscount";
import { useGetMerchantOutlets } from "../hooks/useGetMerchantOutlets";
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from "@react-navigation/native";
import { useEditMerchantDiscount } from "../hooks/useEditMerchantDiscount";
import { useGetMerchantSelectedDiscountDetails } from "../hooks/useGetMerchantSelectedDiscountDetails";
import { useGetMerchantSelectedOutletDiscountDetails } from "../hooks/useGetMerchantSelectedDiscountOutletDetails";
import { useGetMerchantSelectedProductDiscountDetails } from "../hooks/useGetMerchantSelectedDiscountProductDetails";



const initialState = {
    discountCode: '',
    discountValue: '',
    selectedDiscountType: 'percentage',
    selectedDiscountValue: 'ONDEMAND',
    requiredValue: '',
    // isUsageLimitEnabled: false,
    selectedMinimumRequirement: 'NONE',
    selectedAppliesTo: 'ALL',
    // selectedOutlets: [],
    startDate: new Date(),
    endDate: new Date(),
    // isEndDateEnabled: false,
    // applyDiscountOnSpecificDays: false,
    selectedProductIds: [],
};

const formatDateForDisplay = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DISCOUNT_CODE':
            return { ...state, discountCode: action.payload };
        case 'SET_DISCOUNT_VALUE':
            return { ...state, discountValue: action.payload };
        case 'SET_SELECTED_DISCOUNT_TYPE':
            return { ...state, selectedDiscountType: action.payload };
        case 'SET_SELECTED_DISCOUNT_VALUE':
            return { ...state, selectedDiscountValue: action.payload };
        case 'SET_REQUIRED_VALUE':
            return { ...state, requiredValue: action.payload };
        case 'TOGGLE_USAGE_LIMIT':
            return { ...state, isUsageLimitEnabled: !state.isUsageLimitEnabled };
        case 'SET_SELECTED_MINIMUM_REQUIREMENT':
            return { ...state, selectedMinimumRequirement: action.payload };
        case 'SET_SELECTED_APPLIES_TO':
            return { ...state, selectedAppliesTo: action.payload };
        case 'SET_SELECTED_OUTLETS':
            return { ...state, selectedOutlets: action.payload };
        case 'SET_START_DATE':
            return { ...state, startDate: action.payload };
        case 'SET_END_DATE':
            return { ...state, endDate: action.payload };
        case 'TOGGLE_END_DATE':
            return { ...state, isEndDateEnabled: !state.isEndDateEnabled };
        case 'TOGGLE_APPLY_DISCOUNT_ON_SPECIFIC_DAYS':
            return { ...state, applyDiscountOnSpecificDays: !state.applyDiscountOnSpecificDays };
        case 'TOGGLE_PURCHASE_COUNT_START':
            return { ...state, countOnStartDate: !state.countOnStartDate };
        case 'SET_USAGE_LIMIT':
            return { ...state, requiredValueLimit: action.payload };
        case 'SET_SELECTED_PRODUCT_IDS':
            return { ...state, selectedProductIds: action.payload };
        default:
            return state;
    }
};

const AddDiscount = ({ navigation, route }) => {
    const { user } = useSelector((state) => state.auth);
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = React.useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = React.useState(false);
    const [selectedProducts, setSelectedProducts] = React.useState([]);
    const [discountCode, setDiscountCode] = React.useState('');
    const toast = useToast();
    // const navigation = useNavigation();
    const client = useQueryClient();

    const handleStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false); // Close the date picker
        if (selectedDate) {
            dispatch({ type: 'SET_START_DATE', payload: selectedDate });
        }
    };

    const handleStartTimeChange = (event, selectedTime) => {
        setShowStartTimePicker(false); // Close the time picker
        if (selectedTime) {
            const newDate = new Date(state.startDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            dispatch({ type: 'SET_START_DATE', payload: newDate });
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false); // Close the date picker
        if (selectedDate) {
            dispatch({ type: 'SET_END_DATE', payload: selectedDate });
        }
    };

    const handleEndTimeChange = (event, selectedTime) => {
        setShowEndTimePicker(false); // Close the time picker
        if (selectedTime) {
            const newDate = new Date(state.endDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            dispatch({ type: 'SET_END_DATE', payload: newDate });
        }
    };
    const [customerPurchaseOpen, setCustomerPurchaseOpen] = React.useState(false);
    const [valueCustomerPurchase, setValueCustomerPurchse] = React.useState(null);
    const [customerPurchaseItems, setCustomerPurchaseItems] = React.useState([
        { label: '1st Purchase', value: '1' },
        { label: '2nd Purchase', value: '2' },
        { label: '3th Purchase', value: '3' },
        { label: '4th Purchase', value: '4' },
        { label: '5th Purchase', value: '4' },
    ]);
    const [selectedDays, setSelectedDays] = React.useState([]);
    const daysOfWeek = [
        { label: 'Monday', value: 'MONDAY' },
        { label: 'Tuesday', value: 'TUESDAY' },
        { label: 'Wednesday', value: 'WEDNESDAY' },
        { label: 'Thursday', value: 'THURSDAY' },
        { label: 'Friday', value: 'FRIDAY' },
        { label: 'Saturday', value: 'SATURDAY' },
        { label: 'Sunday', value: 'SUNDAY' },
    ];

    const merchant = user.user_merchant_id
    console.log(merchant, "yabayabyabybayba");
    const { discount_id } = route.params || {};
    const { selectedRouteIds } = route.params || {};// Get the discount ID from route params
    const { data: discountDetails, isLoading } = useGetMerchantSelectedDiscountDetails(discount_id);
    const { data: discountOutletDetails, isOutletLoading, refetch: refetchOutlets } = useGetMerchantSelectedOutletDiscountDetails(merchant, discount_id);
    const { data: discountProductDetails, isProductLoading, refetch: refetchProducts } = useGetMerchantSelectedProductDiscountDetails(merchant);
    const { mutate: addDiscount, isLoading: isLoadingDiscount } = useAddMerchantDiscount(res => {
        if (res) {
            if (res?.status === 0) {
                client.invalidateQueries(['add-merchant-discount']);
                toast.show(res?.message, { placement: 'top' });
                navigation.navigate('Manage Discounts');
            } else {
                toast.show(res?.message, { placement: 'top' });
            }
        }
    });

    const { mutate: editDiscount, isLoading: isLoadingEditDiscount } = useEditMerchantDiscount(res => {
        if (res) {
            if (res?.status === 0) {
                client.invalidateQueries(['edit-merchant-discount']);
                toast.show(res?.message, { placement: 'top' });
                navigation.navigate('Manage Discounts');
            } else {
                toast.show(res?.message, { placement: 'top' });
            }
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            refetchOutlets();
            refetchProducts();
        }, [])
    );
    // const { mutate: getSelectedDiscount, isselectedLoading: isLoadingselectDiscount } = useGetMerchantSelectedDiscountDetails(res => {
    //     if (res) {
    //         if (res?.status === 0) {
    //             client.invalidateQueries(['selected-discount-details']);
    //             toast.show(res?.message, { placement: 'top' });
    //             // navigation.navigate('Manage Discounts');
    //         } else {
    //             toast.show(res?.message, { placement: 'top' });
    //         }
    //     }
    // });
    console.log(discountDetails?.data?.data?.discount_code, "jojojojojojojjoj")

    // React.useEffect(() => {
    //     if (discountDetails && discountDetails.status === 0) {
    //         const details = discountDetails.data;
    //         dispatch({ type: 'SET_DISCOUNT_CODE', payload: details.discount_code });
    //         dispatch({ type: 'SET_DISCOUNT_VALUE', payload: details.discount_value });
    //         dispatch({ type: 'SET_SELECTED_DISCOUNT_TYPE', payload: details.discount_type });
    //         dispatch({ type: 'SET_SELECTED_APPLIES_TO', payload: details.apply_to });
    //         // Set other fields as necessary...
    //     }
    // }, [discountDetails]);


    React.useEffect(() => {
        // Retrieve the product_list from route parameters
        if (route.params && route.params.product_list) {
            const productIds = JSON.parse(route.params.product_list);
            setSelectedProducts(productIds);
        }
    }, [route.params]);

    const handleCreateDiscount = () => {
        // Validate required fields
        if (!state.discountValue || !state.startDate || !state.selectedDiscountValue) {
            toast.show("Please provide all required details.", { type: "danger", placement: "top" });
            return;
        }

        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const formatTime = (date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12; // Convert to 12-hour format
            hours = hours ? hours : 12; // The hour '0' should be '12'
            return `${hours}:${minutes} ${ampm}`;
        };

        const discountData = {
            id: discount_id,
            code: discount_id ? discountDetails?.data?.data?.discount_code : state.discountCode,
            type: state.selectedDiscountType === 'percentage' ? 'PERCENTAGE' : 'FIXEDAMOUNT',
            mode: "ONDEMAND",
            value: state.discountValue,
            apply_to: state.selectedAppliesTo,
            required: state.selectedMinimumRequirement.toUpperCase(),
            required_value: state.requiredValue,
            eligible: "ALL",
            limit: isUsageLimitEnabled ? "TOTALCOUNT" : "NONE",
            limit_value: isUsageLimitEnabled ? state.requiredValueLimit : "",
            purchase_count: valueCustomerPurchase ? valueCustomerPurchase : "",
            purchase_count_start_on_date: countOnStartDate ? "YES" : "NO",
            startdate: formatDate(state.startDate),
            starttime: formatTime(state.startDate),
            enddate: isEndDateEnabled ? formatDate(state.endDate) : "",
            endtime: isEndDateEnabled ? formatTime(state.endDate) : "",
            // outlet_list: selectedOutlets.length > 0 ? JSON.stringify(selectedOutlets) : "",
            // outlet_list: JSON.stringify([5878]),
            // product_list: "",
            product_list: selectedProducts.length > 0 ? JSON.stringify(selectedProducts) : "",
            extra_details: JSON.stringify({
                days_of_week: selectedDays,
                routes_list: selectedRouteIds,
            }),
            merchant: user.merchant,
            mod_by: user.login,
        };

        if (discount_id) {


            discountData['old_outlet_list'] = JSON.stringify(outletids); // Adjust as needed
            discountData['old_product_list'] = JSON.stringify(Productids); // Adjust as needed
            // Include outlet_list and product_list only when creating a new discount
            discountData['outlet_list'] = JSON.stringify(selectedOutlets); // Convert selected outlets to JSON array
            //  discountData['product_list'] = JSON.stringify(selectedProductIds);
            // Call the update function
            editDiscount(discountData);
        } else {
            // Include outlet_list and product_list only when creating a new discount
            discountData['outlet_list'] = JSON.stringify(selectedOutlets); // Convert selected outlets to JSON array
            // discountData['product_list'] = JSON.stringify(selectedProducts); // Convert selected product IDs to JSON array

            // Call the add function
            addDiscount(discountData);
        }
    };

    const { data: outlets } = useGetMerchantOutlets(user.merchant);
    // console.log(outlets?.data?.data, "burn baby burn")

    const generateCode = () => {
        const code = Array.from({ length: 15 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join("");
        dispatch({ type: 'SET_DISCOUNT_CODE', payload: code });
    };


    const Productids = discountProductDetails?.data?.data?.filter(item => item !== null).map(item => item?.product_id)
    if (Productids) {
        // console.log(Productids.join(', ')); // Joins the IDs with a comma and space
    }

    // console.log(discountProductDetails?.data, "yayayayayay")


    const [isUsageLimitEnabled, setIsUsageLimitEnabled] = React.useState(() => { false; });
    const [isEndDateEnabled, setIsEndDateEnabled] = React.useState(() => { false; });
    const [applyDiscountOnSpecificDays, setApplyDiscountOnSpecificDays] = React.useState(false);
    const [countOnStartDate, setCountOnStartDate] = React.useState(false);
    const [selectedOutlets, setSelectedOutlets] = React.useState([]);

    React.useEffect(() => {
        if (discountDetails?.data?.data) {
            const discountData = discountDetails.data.data;

            setIsUsageLimitEnabled(discount_id && discountData.discount_limits === "TOTALCOUNT");
            setIsEndDateEnabled(discount_id && discountData.discount_enddate ? true : false);
            setApplyDiscountOnSpecificDays(discount_id && discountData.apply_on_specific_days ? true : false);
            setCountOnStartDate(discount_id && discountData.discount_purchase_on_startdate ? true : false);
        }
    }, [discountDetails, discount_id]);

    React.useEffect(() => {
        if (discountOutletDetails?.data?.data) {
            setSelectedOutlets(discountOutletDetails?.data?.data.filter(i => i).map(i => i?.discount_outlet))
        }
    }, [discountOutletDetails?.data?.data])

    console.log('sell', selectedOutlets)

    const toggleOutletSelection = (outletId) => {
        setSelectedOutlets((prevSelectedOutlets) => {
            if (prevSelectedOutlets.includes(outletId)) {
                return prevSelectedOutlets.filter(id => id !== outletId);
            } else {
                return [...prevSelectedOutlets, outletId];
            }
        });
    };

    let outletids = selectedOutlets

    const purchaseCountLabelMap = customerPurchaseItems.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
    }, {});

    if (isProductLoading || isOutletLoading) {
        return <Loading />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>

            {/* {discountDetails && discountDetails.data.status === 0 && (
                <View>
                    <Text>hi</Text>
                    <Text>{discountDetails?.data?.data?.discount_limits}</Text>
                </View>

            )} */}
            {/* <RadioGroup
                initialValue={discount_id
                    ? discountDetails?.data?.data?.discount_mode
                    : state.selectedDiscountValue}
                onValueChange={(value) => dispatch({ type: 'SET_SELECTED_DISCOUNT_VALUE', payload: value })}

            >

                <View style={styles.radioGroup}>
                    <RadioButton
                        value="DISCOUNT CODE"
                        label="Discount Code"
                        labelStyle={styles.radioLabel}
                        color="rgba(25, 66, 216, 0.87)"
                        disabled={discount_id}
                    />
                    <RadioButton
                        value="AUTOMATIC"
                        label="Automatic Discount"
                        labelStyle={styles.radioLabel}
                        color="rgba(25, 66, 216, 0.87)"
                        disabled={discount_id}
                    />
                </View>
            </RadioGroup> */}

            <ScrollView style={styles.main}>
                <View>
                    {/* <Text style={{ color: 'gray', marginBottom: 10 }}>Setup your coupons; assign coupons to your products, outlet(s) or shop(s) customers can buy from all in ONE ACCOUNT</Text> */}
                    <Text style={styles.sectionTitle}>Discount Code</Text>
                    <View>
                        {state.selectedDiscountValue === "ONDEMAND" && discount_id == undefined && (
                            <Text style={styles.generateCodeText} onPress={generateCode}>
                                Generate code
                            </Text>
                        )}
                        <Input
                            value={discount_id ? discountDetails?.data?.data?.discount_code : state.discountCode}
                            onChangeText={(text) => dispatch({ type: 'SET_DISCOUNT_CODE', payload: text })}
                            placeholder={discount_id ? discountDetails?.data?.data?.discount_code : 'Enter Discount Code or Generate Code '}
                            editable={discount_id ? false : true}
                        />
                        <Text style={{ color: "gray" }}>Customers will enter this discount code at checkout.</Text>
                    </View>
                    <Divider />

                    <Text style={styles.sectionTitle}>Types</Text>
                    <RadioGroup initialValue={discount_id
                        ? discountDetails?.data?.data?.discount_type?.toLowerCase()
                        : state.selectedDiscountType} onValueChange={(value) => dispatch({ type: 'SET_SELECTED_DISCOUNT_TYPE', payload: value })}>
                        <RadioButton
                            value="percentage"
                            label="Percentage"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"

                        />
                        <View style={styles.radioButtonContainer} />
                        <RadioButton
                            value="fixedamount"
                            label="Fixed Amount"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"
                        />
                    </RadioGroup>

                    <View style={styles.radioButtonContainer} />

                    <Text style={styles.sectionTitle}>Value</Text>
                    <Text style={styles.discountValueText}>Discount Value {state.selectedDiscountType === 'percentage' ? '(%)' : '(GHC)'}</Text>
                    <Input
                        value={state.discountValue}
                        onChangeText={(text) => dispatch({ type: 'SET_DISCOUNT_VALUE', payload: text })}
                        placeholder={discount_id ? discountDetails?.data?.data?.discount_value : `Enter Discount Value`}
                        editable={true}
                    />

                    <Divider />
                    <Text style={styles.sectionTitle}>Minimum Requirements</Text>
                    <RadioGroup initialValue={discount_id
                        ? discountDetails?.data?.data?.discount_requirement
                        : state.selectedMinimumRequirement} onValueChange={(value) => dispatch({ type: 'SET_SELECTED_MINIMUM_REQUIREMENT', payload: value })}>
                        <RadioButton
                            value="NONE"
                            label="None"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"
                        />
                        <View style={styles.radioButtonContainer} />
                        <RadioButton
                            value="MINAMOUNT"
                            label="Minimum Purchase Amount"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"
                        />
                        <View style={styles.radioButtonContainer} />
                        <RadioButton
                            value="MINQUANTITY"
                            label="Minimum quantity of items"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"
                        />
                    </RadioGroup>
                    {(discount_id
                        ? discountDetails?.data?.data?.discount_requirement === 'MINAMOUNT' : state.selectedMinimumRequirement === 'MINAMOUNT' || state.selectedMinimumRequirement === 'MINQUANTITY') && (
                            <Input
                                value={state.requiredValue}
                                onChangeText={(text) => dispatch({ type: 'SET_REQUIRED_VALUE', payload: text })}
                                placeholder={discount_id ? discountDetails?.data?.data?.discount_requirement_value : state.selectedMinimumRequirement === 'MINAMOUNT' ? "Minimum Purchase Amount" : "Minimum Quantity of Items"}
                            />

                        )}

                    <View style={styles.radioButtonContainer} />
                    <Text style={styles.sectionTitle}>Usage Limits</Text>
                    <View style={styles.checkboxRow}>
                        <Checkbox
                            color={'#3967E8'}
                            value={isUsageLimitEnabled}
                            onValueChange={setIsUsageLimitEnabled}
                        // label="Limit usage"
                        />
                        <Text style={styles.checkboxLabel}>
                            Limit number of times this discount can be used in total
                        </Text>
                    </View>
                    {isUsageLimitEnabled === true && (
                        <Input
                            value={state.requiredValueLimit}
                            onChangeText={(text) => dispatch({ type: 'SET_USAGE_LIMIT', payload: text })}
                            placeholder={discount_id ? discountDetails?.data?.data?.discount_limits_value : 'Set usage limit'}
                        />

                    )}

                    <Divider />
                    <Text style={styles.sectionTitle}>Applies To</Text>
                    <RadioGroup initialValue={
                        discount_id ? discountDetails?.data?.data?.discount_apply :
                            state.selectedAppliesTo} onValueChange={(value) => dispatch({ type: 'SET_SELECTED_APPLIES_TO', payload: value })}>
                        <RadioButton
                            value="ALL"
                            label="All Products"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"
                        />
                        <View style={styles.radioButtonContainer} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <RadioButton
                                value="SELECTPRODUCTS"
                                label="Specific Products"
                                labelStyle={styles.radioLabel}
                                color="rgba(25, 66, 216, 0.87)"
                            />
                            {(state.selectedAppliesTo === 'SELECTPRODUCTS' ||
                                (discount_id && discountDetails?.data?.data?.discount_apply === 'SELECTPRODUCTS')) && (
                                    <View style={{ backgroundColor: "rgba(25, 66, 216, 0.87)", alignItems: 'center', borderRadius: 50, padding: 5, width: 140 }}>
                                        <Pressable onPress={() => navigation.navigate('ProductlistCoupon', { discount_id })}>
                                            <Text style={{ color: 'white' }}>Select Products</Text>
                                        </Pressable>
                                    </View>
                                )}
                        </View>
                        <View style={styles.radioButtonContainer} />

                        <RadioButton
                            value="PURCHASE"
                            label="Customers Purchase"
                            labelStyle={styles.radioLabel}
                            color="rgba(25, 66, 216, 0.87)"
                        />
                        <View style={styles.radioButtonContainer} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <RadioButton
                                value="DELIVERYROUTES"
                                label="Delivery"
                                labelStyle={styles.radioLabel}
                                color="rgba(25, 66, 216, 0.87)"
                            />
                            {(state.selectedAppliesTo === 'DELIVERYROUTES' ||
                                (discount_id && discountDetails?.data?.data?.discount_apply === 'DELIVERYROUTES')) && (
                                    <View style={{ backgroundColor: "rgba(25, 66, 216, 0.87)", alignItems: 'center', borderRadius: 50, padding: 5 }}>
                                        <Pressable onPress={() => navigation.navigate('DeliverylistCoupon', { discount_id })}>
                                            <Text style={{ color: 'white' }}>Select Routes</Text>
                                        </Pressable>
                                    </View>
                                )}
                        </View>
                    </RadioGroup>

                    {(state.selectedAppliesTo === 'PURCHASE' ||
                        (discount_id && discountDetails?.data?.data?.discount_apply === 'PURCHASE')) && (
                            <View style={{ zIndex: 10000 }}>
                                <View style={styles.radioButtonContainer} />
                                <View style={{ zIndex: 10000 }}>
                                    <DropDownPicker
                                        open={customerPurchaseOpen}
                                        value={valueCustomerPurchase}
                                        items={customerPurchaseItems}
                                        setOpen={setCustomerPurchaseOpen}
                                        setValue={setValueCustomerPurchse}
                                        setItems={setCustomerPurchaseItems}
                                        placeholder={
                                            discount_id &&
                                                parseInt(discountDetails?.data?.data?.discount_purchase_count) > 0
                                                ? purchaseCountLabelMap[discountDetails?.data?.data?.discount_purchase_count] || 'Set Purchase Count'
                                                : 'Set Purchase Count'
                                        }
                                        style={styles.dropdown}
                                    />
                                </View>
                                <View style={styles.radioButtonContainer} />
                                <View style={styles.checkboxRow}>
                                    <Checkbox
                                        color={'#3967E8'}
                                        value={countOnStartDate}
                                        onValueChange={setCountOnStartDate}
                                    // label="Count on start date"
                                    />
                                    <Text style={styles.checkboxLabel}>Purchase count start from Discount Start Date</Text>
                                </View>
                            </View>
                        )}

                    {/* {state.selectedAppliesTo === 'PURCHASE' && (
                        <View style={{ zIndex: 10000 }}>
                            <View style={styles.radioButtonContainer} />
                            <View style={{ zIndex: 10000 }}>
                                <DropDownPicker
                                    open={customerPurchaseOpen}
                                    value={valueCustomerPurchase}
                                    items={customerPurchaseItems}
                                    setOpen={setCustomerPurchaseOpen}
                                    setValue={setValueCustomerPurchse}
                                    setItems={setCustomerPurchaseItems}
                                    placeholder="Select purchase Count"
                                    style={styles.dropdown}
                                />
                            </View>
                            <View style={styles.radioButtonContainer} />
                            <View style={styles.checkboxRow}>
                                <Checkbox
                                    color={'#3967E8'}
                                    value={countOnStartDate}
                                    onValueChange={setCountOnStartDate}
                                // label="Count on start date"
                                />
                                <Text style={styles.checkboxLabel}>Purchase count start from Discount Start Date</Text>
                            </View>
                        </View>
                    )} */}

                    <View style={styles.radioButtonContainer} />
                    <View style={styles.checkboxRow}>
                        <Checkbox
                            color={'#3967E8'}
                            value={applyDiscountOnSpecificDays}
                            onValueChange={setApplyDiscountOnSpecificDays}
                        // label="Specific days"
                        />
                        <Text style={styles.checkboxLabel}>
                            Apply Discount On Specific Days Of The Week
                        </Text>

                    </View>
                    {/* {state.applyDiscountOnSpecificDays === true && (
                        daysOfWeek.map((day) => (
                            <View key={day.value} style={styles.checkboxRow}>
                                <Checkbox
                                    color={'#3967E8'}
                                    value={selectedDays.includes(day.value)}
                                    onValueChange={() => {
                                        if (selectedDays.includes(day.value)) {
                                            setSelectedDays(selectedDays.filter(d => d !== day.value));
                                        } else {
                                            setSelectedDays([...selectedDays, day.value]);
                                        }
                                    }}
                                />
                                <Text style={styles.checkboxLabel}>{day.label}</Text>
                            </View>
                        ))
                    )} */}
                    {applyDiscountOnSpecificDays === true && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 10 }}>
                            {daysOfWeek.map((day) => (
                                <View key={day.value} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <Checkbox
                                        color={'#3967E8'}
                                        value={selectedDays.includes(day.value)}
                                        onValueChange={() => {
                                            if (selectedDays.includes(day.value)) {
                                                setSelectedDays(selectedDays.filter(d => d !== day.value));
                                            } else {
                                                setSelectedDays([...selectedDays, day.value]);
                                            }
                                        }}
                                    />
                                    <Text style={{ marginLeft: 8, fontSize: 14, color: "#002" }}>{day.label}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <Divider />
                    <View>

                        <Text style={styles.sectionTitle}> Active Dates</Text>
                        <View>
                            <View style={styles.dateTimeStyles}>
                                <Pressable onPress={() => setShowStartDatePicker(true)} style={{ width: 170 }}>
                                    <Text style={{ color: '#000' }}>Start Date</Text>
                                    <Input
                                        placeholder="Select Date"
                                        value={formatDateForDisplay(state.startDate)}
                                        editable={false}
                                    />
                                </Pressable>

                                <Pressable onPress={() => setShowStartTimePicker(true)} style={{ width: 170 }}>
                                    <Text style={{ color: '#000' }}>Start Time</Text>
                                    <Input
                                        placeholder="Select Time"
                                        value={state.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        editable={false}
                                    />
                                </Pressable>
                                {showStartDatePicker && (
                                    <DateTimePicker
                                        value={state.startDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleStartDateChange}
                                    />
                                )}

                                {showStartTimePicker && (
                                    <DateTimePicker
                                        value={state.startDate}
                                        mode="time"
                                        display="default"
                                        onChange={handleStartTimeChange}
                                    />
                                )}
                            </View>
                            <View style={styles.checkboxRow}>
                                <Checkbox
                                    color={'#3967E8'}
                                    value={isEndDateEnabled}
                                    onValueChange={setIsEndDateEnabled}
                                // label="Enable end date"
                                />
                                <Text style={styles.checkboxLabel}> Set end date</Text>
                            </View>
                            {isEndDateEnabled && (
                                <View style={styles.dateTimeStyles}>
                                    <Pressable onPress={() => setShowEndDatePicker(true)} style={{ width: 170 }}>
                                        <Text style={{ color: '#000' }}>End Date</Text>
                                        <Input
                                            placeholder="Select Date"
                                            value={formatDateForDisplay(state.endDate)}
                                            editable={false}
                                        />
                                    </Pressable>

                                    <Pressable onPress={() => setShowEndTimePicker(true)} style={{ width: 170 }}>
                                        <Text style={{ color: '#000' }}>End Time</Text>
                                        <Input
                                            placeholder="Select Time"
                                            value={state.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            editable={false}
                                        />
                                    </Pressable>
                                    {showEndDatePicker && (
                                        <DateTimePicker
                                            value={state.endDate}
                                            mode="date"
                                            display="default"
                                            onChange={handleEndDateChange}
                                        />
                                    )}

                                    {showEndTimePicker && (
                                        <DateTimePicker
                                            value={state.endDate}
                                            mode="time"
                                            display="default"
                                            onChange={handleEndTimeChange}
                                        />
                                    )}

                                </View>
                            )}
                        </View>
                    </View>
                    <Divider />
                    <View>
                        <Text style={styles.sectionTitle}>Outlets</Text>
                        <View style={{}}>
                            <FlatList
                                contentContainerStyle={styles.listContainer}
                                data={outlets?.data?.data ?? []}
                                keyExtractor={(item) => item?.outlet_id?.toString()}
                                renderItem={({ item }) => {
                                    if (item) {
                                        return (
                                            <View style={styles.itemRow}>
                                                <Text style={styles.outletName}>{item?.outlet_name}</Text>
                                                <View style={{ marginHorizontal: 5 }} />
                                                <Checkbox
                                                    color={'#3967E8'}
                                                    value={selectedOutlets.includes(item?.outlet_id)}
                                                    onValueChange={() => toggleOutletSelection(item?.outlet_id)}
                                                />
                                            </View>
                                        );
                                    }
                                    return null;
                                }}
                            />

                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.btnWrapper}>
                <PrimaryButton
                    style={styles.btn}
                    handlePress={handleCreateDiscount}
                >
                    {discount_id
                        ? (isLoadingEditDiscount ? "Processing" : "Edit Coupon")
                        : (isLoadingDiscount ? "Processing" : "Create Coupon")}
                </PrimaryButton>
            </View>
        </View>
    );
};

export default AddDiscount;

const styles = StyleSheet.create({
    main: {
        height: "100%",
        paddingHorizontal: 26,
        marginBottom: 78,
        marginTop: 26,
        backgroundColor: "#fff",
    },
    radioGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    radioLabel: { fontFamily: "ReadexPro-Regular", fontSize: 14, color: "#002" },
    sectionTitle: { color: "rgba(25, 66, 216, 0.87)", marginBottom: 10 },
    generateCodeText: { textAlign: "right", color: 'rgba(25, 66 , 150, 1.87)' },
    discountValueText: { color: "black" },
    checkboxRow: { flexDirection: "row" },
    checkboxLabel: { color: "#002", fontSize: 13, marginLeft: 4, marginTop: 2 },
    btnWrapper: {
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        width: "100%",
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderTopColor: "#ddd",
        borderTopWidth: 0.5,
    },
    btn: { width: "90%" },
    radioButtonContainer: { marginBottom: 10 },
    dateTimeStyles: {
        flexDirection: 'row',
        justifyContent: "space-between",
        flex: 1,
        backgroundColor: "#fff",
    },
    listContainer: {
        padding: 1,
    },
    itemRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginLeft: 1,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    outletName: {
        color: '#000',
        flex: 1,
        marginRight: 10,
    },
    dropdown: {
        zIndex: 1000,
    },
});

const Divider = () => (
    <View
        style={{
            borderColor: "rgba(25, 66, 216, 0.1)",
            borderBottomWidth: 1,
            marginVertical: 14,
        }}
    />
);



