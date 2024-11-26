import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, FlatList, Pressable, StyleSheet, Text, RefreshControl, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetRiderDeliveryConfig } from '../hooks/useGetRiderDeliveryConfig';
import { useGetMerchantLocationDelivery } from '../hooks/useGetMerchantLocationDelivery';
import { useGetMerchantDistanceDelivery } from '../hooks/useGetMerchantDistanceDelivery';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { Checkbox } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from './PrimaryButton';

const DeliveryListCoupon = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const navigation = useNavigation();
    const { user } = useSelector(state => state.auth);
    const { outlet } = useSelector(state => state.auth);
    const toast = useToast();
    const client = useQueryClient();

    const { data: deliveryConfig } = useGetRiderDeliveryConfig(user.user_merchant_id);
    const { data: dataLocation, refetch: refetchLocationDelivery, isFetchingLocation } = useGetMerchantLocationDelivery(user.user_merchant_id, outlet?.outlet_id);
    const { data: dataDistance, refetch: refetchDeliveryDistance, isFetchingDistance } = useGetMerchantDistanceDelivery(user.user_merchant_id, outlet?.outlet_id);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        if (deliveryConfig?.data?.message?.delivery_type === 'DISTANCE_BASED') {
            await refetchDeliveryDistance();
        } else if (deliveryConfig?.data?.message?.delivery_type === 'LOCATION_BASED') {
            await refetchLocationDelivery();
        }
        setRefreshing(false);
    }, [refetchDeliveryDistance, refetchLocationDelivery, deliveryConfig]);


    useEffect(() => {
        // Call handleRefresh on every mount to ensure data is fetched
        handleRefresh();
    }, [handleRefresh]);

    const handleRouteSelection = (routeId) => {
        // Toggle route selection
        if (selectedRoutes.includes(routeId)) {
            setSelectedRoutes(selectedRoutes.filter(id => id !== routeId));
        } else {
            setSelectedRoutes([...selectedRoutes, routeId]);
        }
    };

    const handleAddRoutes = () => {
        // Pass the selected route IDs to the Add Discount screen
        navigation.navigate('Create Coupon', { selectedRouteIds: selectedRoutes });
    };

    const renderLocationList = () => (
        <FlatList
            refreshControl={<RefreshControl refreshing={isFetchingLocation || refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={{
                paddingBottom: Dimensions.get('window').height * 0.1,
                marginHorizontal: 10,
            }}
            data={dataLocation?.data?.message ?? []}
            keyExtractor={(item) => item?.delivery_id?.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Checkbox
                            value={selectedRoutes.includes(item.delivery_code)}
                            onValueChange={() => handleRouteSelection(item.delivery_code)}
                        />
                        <Text style={styles.cellText}>{item.location}</Text>
                        <Text style={styles.rateText}>{item.price}</Text>
                    </View>
                </View>
            )}
        />
    );

    const renderDistanceList = () => (
        <FlatList
            refreshControl={<RefreshControl refreshing={isFetchingDistance || refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={{
                paddingBottom: Dimensions.get('window').height * 0.1,
                marginHorizontal: 10,
            }}
            data={dataDistance?.data?.message ?? []}
            keyExtractor={(item) => item?.delivery_id?.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Checkbox
                            value={selectedRoutes.includes(item.delivery_code)}
                            onValueChange={() => handleRouteSelection(item.delivery_code)}
                        />
                        <Text style={styles.cellText}>{item.start_distance} - {item.end_distance}</Text>
                        <Text style={styles.rateText}>{item.price}</Text>
                    </View>
                </View>
            )}
        />
    );

    return (
        <View style={styles.container}>
            {deliveryConfig?.data?.message?.delivery_type === 'DISTANCE_BASED' ? renderDistanceList() :
                deliveryConfig?.data?.message?.delivery_type === 'LOCATION_BASED' ? renderLocationList() :
                    <></>
            }

            <PrimaryButton
                style={styles.addButton}
                handlePress={handleAddRoutes}
            >
                <Text style={styles.addButtonText}>Add Routes</Text>
            </PrimaryButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderColor: '#dcdcdc',
        borderWidth: 1,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cellText: {
        color: '#333',
        fontSize: 15,
        flex: 2,
        textAlign: 'center',
    },
    rateText: {
        color: '#28a745',
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#3967E8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DeliveryListCoupon;