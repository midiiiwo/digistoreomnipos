import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Dimensions, Image, RefreshControl } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import { useGetMerchantDeliveryWindow } from '../hooks/useGetMerchantDeliveryWindow';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useQueryClient } from 'react-query';
import { useGetRiderDeliveryConfig } from '../hooks/useGetRiderDeliveryConfig';
import { useChangeStoreDeliveryWindowConfig } from '../hooks/useChangeStoreDeliveryWindowConfig';
import Bin from '../../assets/icons/delcross';
import { FloatingButton } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const DeliveryWindow = () => {
    const { user, outlet } = useSelector(state => state.auth);
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const merchantId = user?.user_merchant_id;

    // Fetch delivery configuration
    const { data: deliveryConfig } = useGetRiderDeliveryConfig(merchantId);
    const {
        data: dataDeliveryWindow,
        refetch: refetchDeliveryWindow,
        isFetching: isFetchingDeliveryWindow,
    } = useGetMerchantDeliveryWindow(merchantId, outlet?.outlet_id);

    const [isEnabled, setIsEnabled] = useState(false);

    // Handle refresh logic
    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetchDeliveryWindow();
        setRefreshing(false);
    }, [refetchDeliveryWindow]);

    useEffect(() => {
        if (deliveryConfig?.data?.code === 200) {
            const useWindows = deliveryConfig.data.message.use_windows;
            setIsEnabled(useWindows);
            console.log(useWindows, "hello");
        } else {
            console.error("Error fetching delivery config:", deliveryConfig?.data?.code);
        }
    }, [deliveryConfig]);

    const changeDeliveryWindowConfig = useChangeStoreDeliveryWindowConfig((data) => {
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Delivery Type Changed',
            textBody: `Delivery type changed to: ${data.message}`,
        });
        queryClient.invalidateQueries(['getMerchantDeliveryWindow']); // Refetch after change
    });

    const toggleSwitch = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        changeDeliveryWindowConfig.mutate({
            merchant: merchantId,
            use_windows: newState ? "YES" : "NO",
        });
    };


    useEffect(() => {
        // Refetch delivery window whenever the screen comes into focus
        refetchDeliveryWindow();
    }, [refetchDeliveryWindow])

    return (
        <View style={{ flex: 1 }}>
            {/* Switch with Text */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 20 }}>
                <Switch
                    value={isEnabled}
                    onValueChange={toggleSwitch}
                    onColor="blue"
                />
                <Text style={{ marginLeft: 10 }}>Enable Delivery Windows</Text>
            </View>

            <View style={{ flex: 1, marginTop: 20 }}>
                {isEnabled ? (
                    <FlatList
                        refreshControl={<RefreshControl refreshing={isFetchingDeliveryWindow || refreshing} onRefresh={handleRefresh} />}
                        contentContainerStyle={styles.listContainer}
                        data={dataDeliveryWindow?.data?.message ?? []}
                        keyExtractor={(item) => item?.user_id?.toString()}
                        ListHeaderComponent={() => (
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerText, { flex: 0.5, textAlign: 'left' }]}>#</Text>
                                <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Outlet</Text>
                                <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Day</Text>
                                <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Start Time</Text>
                                <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>End Time</Text>
                                <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Cut-Off Time</Text>
                                <Text style={[styles.headerText, { flex: 0.5, textAlign: 'right' }]}>Actions</Text>
                            </View>
                        )}
                        renderItem={({ item, index }) => (
                            <View style={styles.itemRow}>
                                <Text style={[styles.cellText, { flex: 0.5, textAlign: 'left' }]}>{index + 1}</Text>
                                <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>{outlet?.outlet_name}</Text>
                                <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>{item.day}</Text>
                                <Text style={[styles.rateText, { flex: 1, textAlign: 'center' }]}>{item.start_time}</Text>
                                <Text style={[styles.rateText, { flex: 1, textAlign: 'center' }]}>{item.end_time}</Text>
                                <Text style={[styles.rateText, { flex: 1, textAlign: 'center' }]}>{item.cutoff_time}</Text>
                                <Pressable
                                    style={[styles.deleteButton, { flex: 0.5, alignItems: 'flex-end' }]}
                                    onPress={() => {
                                        // Handle delete action here
                                    }}
                                >
                                    <Bin height={20} width={20} color="red" />
                                </Pressable>
                            </View>
                        )}
                    />
                ) : (
                    <View style={styles.noDeliveryWindowContainer}>
                        <Image
                            source={require('../../assets/images/delivery-window.png')}
                            style={{ height: 300, width: 300 }}
                        />
                        <Text style={styles.noDeliveryText}>No Delivery Window</Text>
                    </View>
                )}
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                {/* <PrimaryButton style={styles.btn} handlePress={() => navigation.navigate('Add Rider')}>
                    Add Rider
                </PrimaryButton> */}
                {isEnabled ? (
                    <FloatingButton
                        visible={true}
                        hideBackgroundOverlay
                        // bottomMargin={Dimensions.get('window').width * 0.18}

                        button={{
                            label: 'Add Delivery Window',
                            onPress: () => {
                                navigation.navigate('Add Window');
                            },

                            style: {
                                // marginLeft: 'auto',
                                // marginRight: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '50%',
                                backgroundColor: 'rgba(60, 121, 245, 1.0)',
                                marginBottom: Dimensions.get('window').width * 0.05,
                            },
                        }}
                    />) : (
                    <></>
                )}
            </View>
        </View>
    );
}

export default DeliveryWindow;

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: Dimensions.get('window').height * 0.1,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 18,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
    cellText: {
        color: '#333',
        fontSize: 15,
    },
    rateText: {
        color: '#28a745',
        fontSize: 15,
        fontWeight: 'bold',
    },
    noDeliveryWindowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    noDeliveryText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#006400',
    },
});
