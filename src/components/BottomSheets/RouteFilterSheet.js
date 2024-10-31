import React from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useSelector } from 'react-redux';
import { useChangeStoreDeliveryConfig } from '../../hooks/useChangeStoreDeliveryConfig';

const routeTypes = [
    { id: '1', name: 'LOCATION BASED' },
    { id: '2', name: 'DISTANCE BASED' },
    { id: '3', name: 'DIGISTORE DELIVERIES' },
];

function RouteFilterSheet(props) {
    const { user } = useSelector(state => state.auth);
    const merchantId = user?.user_merchant_id;
    const changeDeliveryConfig = useChangeStoreDeliveryConfig((data) => {
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Delivery Type Changed',
            textBody: `Delivery type changed to: ${data.message}`,
        });
    });

    const handleSelectDeliveryType = async (type) => {
        if (!merchantId) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Merchant ID is required.',
            });
            return;
        }

        // Set the payload based on type
        const payload = {
            merchant: merchantId,
            delivery_type:
                type === 'LOCATION BASED' ? 'LOCATION_BASED' :
                    type === 'DISTANCE BASED' ? 'DISTANCE_BASED' :
                        'DIGISTORE',
        };

        try {
            await changeDeliveryConfig.mutateAsync(payload);
            props.setFilterType(type); // Update filter
            props.sheetId && SheetManager.hide(props.sheetId);
        } catch (error) {
            console.error("Error changing delivery type:", error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Failed to change delivery type.',
            });
        }
    };

    return (
        <ActionSheet
            id={props.sheetId}
            containerStyle={styles.containerStyle}>
            <View style={styles.main}>
                <View style={styles.header}>
                    <Text style={styles.mainText}>Manage Deliveries</Text>
                </View>
                <FlatList
                    data={routeTypes}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => handleSelectDeliveryType(item.name)}
                            style={styles.pressable}>
                            <Text style={styles.channelText}>{item.name}</Text>
                        </Pressable>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </ActionSheet>
    );
}

const styles = StyleSheet.create({
    containerStyle: { marginBottom: 0 },
    main: { paddingBottom: 12 },
    header: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 },
    mainText: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#30475E' },
    pressable: { borderBottomWidth: 0.3, paddingVertical: 18, paddingHorizontal: 18, flexDirection: 'row' },
    channelText: { fontFamily: 'Lato-Semibold', fontSize: 17, color: '#30465e' },
});

export default RouteFilterSheet;
