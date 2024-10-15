/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomButton from '../Button';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

function DeliveryConfigure({ sheetId, payload }) {
    const ref = React.useRef(null);
    // const insets = useSafeAreaInsets();
    const { user } = useSelector(state => state.auth);
    return (
        <ActionSheet
            id={sheetId}
            statusBarTranslucent={false}
            drawUnderStatusBar={false}
            gestureEnabled={true}
            containerStyle={styles.containerStyle}
            indicatorStyle={styles.indicatorStyle}
            springOffset={50}
            openAnimationConfig={{ bounciness: 0 }}
            ref={ref}
            defaultOverlayOpacity={0.3}>
            <View style={styles.buttonContainer}>
                <CustomButton
                    width="100%"
                    backgroundColor="#1942D8"
                    color="#fff"
                    handlePress={() => {

                    }}>
                    Add Delivery Route
                </CustomButton>
                <View style={styles.separator} />
                <CustomButton
                    width="100%"
                    backgroundColor="rgba(217, 217, 217, 0.25)"
                    // insetHeight={insets.bottom}
                    handlePress={() => {

                    }}
                    color="#1942D8">
                    Add Delivery Rider
                </CustomButton>
            </View>
        </ActionSheet>
    );
}

const styles = StyleSheet.create({
    containerStyle: {},
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    indicatorStyle: {
        display: 'none',
    },
});

export default DeliveryConfigure;
