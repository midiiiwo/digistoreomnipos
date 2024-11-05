import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useAddMerchantRider } from '../hooks/useAddMerchantRider';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import { useAddMerchantRouteLocation } from '../hooks/useAddMerchantRouteLocation';
import { useAddMerchantRouteDistance } from '../hooks/useAddMerchantRouteDistance';
import Input from '../components/Input';
import { s } from 'react-native-wind';
import Icon from 'react-native-vector-icons/AntDesign';
import { SelectList } from 'react-native-dropdown-select-list';

const reducer = (state, action) => {
    switch (action.type) {
        case 'name':
            return { ...state, name: action.payload };
        case 'contact':
            return { ...state, contact: action.payload };
        case 'network':
            return { ...state, network: action.payload };
        case 'licence':
            return { ...state, licence: action.payload };
        default:
            return state;
    }
};

const AddRoutes = ({ route, navigation }) => {
    const { filterType } = route.params;
    const { user } = useSelector(state => state.auth);
    const { data, refetch, isFetching } = useGetMerchantOutlets(user.user_merchant_id);
    const [saved, setSaved] = React.useState();
    const [showError, setShowError] = React.useState(false);
    const [state, dispatch] = React.useReducer(reducer, {
        name: '',
        contact: '',
        outlet: '',
        license: '',
        vehicle: '',
        merchant_id: user,
    });
    const [selectedOutlet, setSelectedOutlet] = React.useState(null);
    const toast = useToast();
    const client = useQueryClient();

    const addRider = useAddMerchantRider(i => {
        if (i) {
            setSaved(i);
        }
        if (i.status == 0) {
            client.invalidateQueries('merchant-riders');
        }
    });


    const outletData = data.data.data || [];
    // Filter out null values and map to get the outlet names
    const dataOutlet = [
        { value: "Select All", key: "all" },
        ...outletData
            .filter(outlet => outlet !== null)
            .map(outlet => ({
                value: outlet.outlet_name,
                key: outlet.outlet_id,
            })),
    ];

    React.useEffect(() => {
        if (saved) {
            console.log('Saved response:', saved);
            const toastType = saved.code === 200 ? 'success' : 'danger';
            toast.show(saved.message, { placement: 'top', type: toastType });
            if (saved.code === 200) {
                navigation.goBack();
            }
            setSaved(null);
        }
    }, [saved, toast, navigation]);

    const handleTextChange = React.useCallback(
        ({ type, payload }) => {
            dispatch({
                type,
                payload,
            });
        },
        [dispatch]
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {filterType === 'LOCATION_BASED' ? (
                <View style={{ height: '100%', marginTop: 100 }}>
                    <ScrollView style={styles.main}>
                        <SelectList
                            setSelected={setSelectedOutlet} // Use the selected outlet state
                            data={dataOutlet} // Use the formatted data
                            save="value" // Save the outlet ID
                        />
                        <View style={s`flex-row items-center justify-between`}>
                            <Input
                                style={s`flex-1 mr-2`}
                                placeholder="Enter location"
                                showError={showError && state.name?.length === 0}
                                val={state.name}
                                setVal={text =>
                                    handleTextChange({
                                        type: 'name',
                                        payload: text,
                                    })
                                }
                            />
                            <Input
                                style={s`flex-1 ml-2`}
                                placeholder="Price"
                                showError={showError && state.contact?.length === 0}
                                val={state.contact}
                                setVal={text =>
                                    handleTextChange({
                                        type: 'contact',
                                        payload: text,
                                    })
                                }
                                keyboardType="phone-pad"
                            />
                            <View style={s`flex-row ml-2`}>
                                <Icon name="delete" size={40} color="#900" style={s`mr-2`} />
                                <Icon name="pluscircleo" size={40} color='rgba(25, 66, 216, 0.9)' />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <></>
            )};
            <View style={styles.btnWrapper}>
                <PrimaryButton
                    style={styles.btn}
                    disabled={addRider.isLoading}
                    handlePress={() => {
                        if (
                            state.name?.length === 0 ||
                            state.contact?.length === 0 ||
                            !selectedOutlet // Check if an outlet is selected
                        ) {
                            setShowError(true);
                            toast.show('Please provide all required details.', {
                                placement: 'top',
                                type: 'danger',
                            });
                            return;
                        }
                        addRider.mutate({
                            name: state.name,
                            vehicle: state.vehicle || '',
                            telephone: state.contact,
                            outlet: selectedOutlet, // Use the selected outlet ID
                            license: state.licence || '',
                            merchant_id: user.merchant,
                        });
                    }}
                >
                    {addRider.isLoading ? (
                        <Text>Processing</Text>) : (<Text>Save Routes</Text>)}
                </PrimaryButton>
            </View>
        </View>
    );
};

export default AddRoutes;

const styles = StyleSheet.create({
    main: {
        height: '100%',
        paddingHorizontal: 26,
        marginBottom: 78,
        marginTop: 26,
        backgroundColor: '#fff',
    },
    btnWrapper: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderTopColor: '#ddd',
        borderTopWidth: 0.6,
    },
    btn: {
        borderRadius: 4,
        width: '90%',
    },
});
