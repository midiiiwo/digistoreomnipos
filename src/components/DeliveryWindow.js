import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import { s } from 'react-native-wind';

const DeliveryWindow = () => {
    // Step 1: Initialize isEnabled with useState to control the switch state
    const [isEnabled, setIsEnabled] = useState(false);

    // Step 2: Toggle function for the Switch
    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
    };

    return (
        <View style={{ backgroundColor: 'rgba(146, 169, 189, 0.3)', flex: 1 }}>
            {/* Switch with Text */}
            <View style={s`flex-row justify-end items-end mt-5 items-center`}>
                <Switch
                    style={s`bg-blue-500 mr-3`}
                    value={isEnabled}        // Switch's value is controlled by isEnabled state
                    onValueChange={toggleSwitch}
                    onColor="green"// Calls toggleSwitch to change isEnabled
                />
                <Text>Enable Delivery Windows</Text>
            </View>

            <View style={s`mt-10 flex-1`}>
                {/* Conditionally render FlatList or Hello World text */}
                {isEnabled ? (
                    <FlatList
                        contentContainerStyle={{
                            paddingBottom: Dimensions.get('window').height * 0.1,
                            marginHorizontal: 10,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}
                        ListHeaderComponent={() => (
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerText, { flex: 0.5, textAlign: 'left' }]}>Outlet</Text>
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
                                <Text style={[styles.cellText, { flex: 2, textAlign: 'center' }]}>{item.location}</Text>
                                <Text style={[styles.rateText, { flex: 1, textAlign: 'center' }]}>{item.price}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.helloText}>Hello World</Text>
                )}
            </View>
        </View>
    );
}

export default DeliveryWindow;

const styles = StyleSheet.create({
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
    helloText: {
        fontSize: 24,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});
