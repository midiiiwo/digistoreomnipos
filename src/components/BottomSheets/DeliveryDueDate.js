/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../../hooks/useActionCreator';
import { DateTimePicker } from 'react-native-ui-lib';

function DeliveryDueDate(props) {
  const { deliveryDueDate } = useSelector(state => state.sale);
  const { setDeliveryDueDate } = useActionCreator();
  // const { user } = useSelector(state => state.auth);
  const ref = React.useRef(null);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={ref}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Select Delivery Due Date</Text>
        </View>
        <View style={styles.dateWrapper}>
          <DateTimePicker
            title={''}
            placeholder={'Delivery Due Date'}
            mode={'date'}
            migrate
            value={deliveryDueDate}
            onChange={val => {
              setDeliveryDueDate(val);
              ref.current?.hide();
            }}
            // dateFormat="ddd, Do MMMM, YYYY"
          />
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    // height: '92%',
    borderRadius: 0,
    backgroundColor: '#fff',
  },
  containerStyle: {
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.5,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#30475E',
    letterSpacing: 0,
  },

  dateWrapper: {
    marginVertical: 16,
    paddingHorizontal: 12,
    marginTop: 30,
  },
});

export default DeliveryDueDate;

