/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import ProfileIcon from '../../assets/icons/transactions.svg';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ManageDeliveriesHeader = ({ navigation }) => {
    const tabValues = ['Riders', 'Delivery Routes', 'Delivery Window'];
    const { invoicingTab } = useSelector(state => state.invoice);
    const { setActiveInvoiceTab } = useActionCreator();
    const { top } = useSafeAreaInsets();

    const handleTabChange = (index) => {
        setActiveInvoiceTab(index);

        // Navigate based on selected tab index
        if (index === 0) {
            navigation.navigate('Riders');
        } else if (index === 1) {
            navigation.navigate('Delivery Routes');
        } else if (index === 2) {
            navigation.navigate('Delivery Window');
        }
    };

    return (
        <View style={[styles.headerMain, { paddingTop: top + 10 }]}>
            <Pressable
                onPress={() => navigation.openDrawer()}
                style={styles.back}
            >
                <ProfileIcon height={28} width={27} stroke="#30475e" />
            </Pressable>

            <View style={styles.segmentedControlWrapper}>
                <SegmentedControl
                    values={tabValues}
                    selectedIndex={invoicingTab}
                    onChange={event => handleTabChange(event.nativeEvent.selectedSegmentIndex)}
                    backgroundColor="rgba(96, 126, 170, 0.05)"
                    tintColor="rgba(25, 66, 216, 0.9)"
                    activeFontStyle={styles.activeText}
                    fontStyle={styles.inactiveText}
                    style={styles.arbitrary}
                    sliderStyle={{ borderRadius: 40 }}
                />
            </View>
        </View>
    );
};

export default ManageDeliveriesHeader;

const styles = StyleSheet.create({
    headerMain: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 18,
        paddingLeft: 22,
    },
    arbitrary: {
        height: 42,
        width: 500,
        borderRadius: 40,
    },
    segmentedControlWrapper: {
        marginRight: 'auto',
    },
    activeText: {
        fontSize: 15,
        color: '#fff',
        fontFamily: 'ReadexPro-Medium',
        fontWeight: '100',
        letterSpacing: 0.4,
    },
    inactiveText: {
        fontSize: 15,
        color: '#30475e',
        fontFamily: 'ReadexPro-Medium',
        fontWeight: '100',
        letterSpacing: 0.4,
    },
    headerText: {
        marginLeft: 'auto',
        marginRight: 14,
        color: '#1942D8',
        fontFamily: 'ReadexPro-Medium',
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 'auto',
    },
});
