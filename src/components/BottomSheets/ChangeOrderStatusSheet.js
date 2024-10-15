/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { Picker as RNPicker } from 'react-native-ui-lib';

import Picker from '../../components/Picker';
import PrimaryButton from '../PrimaryButton';
import { useUpdateDeliveryStatus } from '../../hooks/useUpdateDeliveryStatus';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import { useUpdateOrderStatus } from '../../hooks/useUpdateOrderStatus';
import { useAssignRider } from '../../hooks/useAssignRider';
import { useGetOutletLov } from '../../hooks/useGetOutletLov';
import { useReassignToShop } from '../../hooks/useReassignToShop';

function ChangeOrderStatusSheet(props) {
  const client = useQueryClient();
  const [deliveryResponse, setDeliveryResponse] = React.useState();
  const { user } = useSelector(state => state.auth);
  const updateDeliveryStatus = useUpdateDeliveryStatus(i => {
    client.invalidateQueries('selected-order');
    client.invalidateQueries('all-orders');
    setDeliveryResponse(i);
  });
  const [reassignOptions, setReassignOptions] = React.useState();
  const updateOrderStatus = useUpdateOrderStatus(i => {
    client.invalidateQueries('selected-order');
    client.invalidateQueries('all-orders');
    setDeliveryResponse(i);
  });

  const assignRider = useAssignRider(i => {
    client.invalidateQueries('selected-order');
    client.invalidateQueries('all-orders');
    setDeliveryResponse(i);
  });
  const reassignToShop = useReassignToShop(i => {
    client.invalidateQueries('selected-order');
    client.invalidateQueries('all-orders');
    setDeliveryResponse(i);
  });
  const [deliveryStatus, setDeliveryStatus] = React.useState();
  const { data: lov, isLoading: lovLoading } = useGetOutletLov(
    user.merchant,
    deliveryStatus && deliveryStatus.value === 'REASSIGN',
  );

  const toast = useToast();

  const { item, config } = props.payload;

  const statusOptions = [];

  if (item.order_status === 'PAID') {
    if (item.delivery_type === 'PICKUP') {
      statusOptions.push({
        value: 'PICKUP_READY',
        label: 'READY FOR PICKUP',
        updateType: 'order',
      });
    } else if (item.delivery_type === 'DELIVERY') {
      if (
        (config && config.option_delivery === 'MERCHANT') ||
        (config && config.option_delivery === 'MERCHANT-DIST')
      ) {
        if (item.delivery_outlet !== '' && item.delivery_outlet !== null) {
          if (
            item.delivery_rider === null ||
            item.delivery_rider === '' ||
            item.delivery_rider === 'null'
          ) {
            statusOptions.push({
              value: 'ASSIGNRIDER',
              label: 'ACCEPT ORDER',
              updateType: 'order',
            });
          }
        }
      }
      if (
        item.delivery_rider !== null &&
        item.delivery_rider !== '' &&
        item.delivery_status === 'PENDING'
      ) {
        statusOptions.push({
          value: 'PICKUP_READY',
          label: 'READY FOR DELIVERY',
          updateType: 'order',
        });
      }

      if (
        (config && config.option_delivery === 'MERCHANT') ||
        (config && config.option_delivery === 'MERCHANT-DIST')
      ) {
        statusOptions.push({
          value: 'REASSIGN',
          label: 'REASSIGN DELIVERY SHOP',
          updateType: 'order',
        });
      }

      if (
        config &&
        (config.option_delivery === 'MERCHANT' ||
          config.option_delivery === 'MERCHANT-DIST') &&
        config.option_closure === 'YES'
      ) {
        if (
          item.delivery_status !== 'PENDING' ||
          item.delivery_status !== 'DELIVERED'
        ) {
          statusOptions.push({
            value: 'DELIVERED',
            label: 'CLOSE ORDER AS DELIVERED',
            updateType: 'delivery',
          });
        }
      }
    }
  } else if (item.order_status === 'PICKUP_READY') {
    if (
      item.delivery_type === 'PICKUP' &&
      config &&
      config.option_closure === 'YES'
    ) {
      if (
        item.delivery_status !== 'CANCELLED' &&
        item.delivery_status !== 'DELIVERED'
      ) {
        statusOptions.push({
          value: 'DELIVERED',
          label: 'CLOSE ORDER AS DELIVERED',
          updateType: 'delivery',
        });
      }
    } else if (item.delivery_type === 'DELIVERY') {
      if (
        config &&
        (config.option_delivery === 'MERCHANT' ||
          (config.option_delivery === 'MERCHANT-DIST' &&
            config.option_closure === 'YES'))
      ) {
        if (
          item.delivery_status !== 'CANCELLED' &&
          item.delivery_status !== 'DELIVERED'
        ) {
          statusOptions.push({
            value: 'DELIVERED',
            label: 'CLOSE ORDER AS DELIVERED',
            updateType: 'delivery',
          });
        }
      }
    }
  }

  React.useEffect(() => {
    if (deliveryResponse) {
      toast.show(deliveryResponse.message, { placement: 'top' });
      SheetManager.hideAll();
      setDeliveryResponse(null);
    }
  }, [deliveryResponse, toast]);

  console.log(deliveryStatus);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      indicatorStyle={styles.indicatorStyle}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <Picker
          value={deliveryStatus}
          setValue={c => {
            setDeliveryStatus(c);
          }}
          placeholder="Select order status">
          {statusOptions.map(i => {
            if (!i) {
              return;
            }
            return <RNPicker.Item key={i.label} label={i.label} value={i} />;
          })}
        </Picker>
        <View style={{ marginVertical: 18 }} />
        {!lovLoading &&
          lov &&
          lov.data &&
          lov.data.data &&
          deliveryStatus &&
          deliveryStatus.value === 'REASSIGN' && (
            <Picker
              value={reassignOptions}
              setValue={c => {
                setReassignOptions(c);
              }}
              placeholder="Select outlet to reassign to">
              {lov &&
                lov.data &&
                lov.data.data.map(i => {
                  console.log('iiiiii', i);
                  if (!i) {
                    return;
                  }
                  if (i.outlet_name === item.delivery_outlet) {
                    return;
                  }
                  return (
                    <RNPicker.Item
                      key={i.outlet_id}
                      label={i.outlet_name}
                      value={i.outlet_id}
                    />
                  );
                })}
            </Picker>
          )}
        <PrimaryButton
          style={{ borderRadius: 4 }}
          handlePress={() => {
            const payload = {
              no: item.order_no,
              mod_by: user.login,
              merchant: user.merchant,
            };
            if (deliveryStatus.value === 'ASSIGNRIDER') {
              assignRider.mutate({ ...payload, rider: '0' });
              return;
            }
            if (deliveryStatus.value === 'REASSIGN' && reassignOptions) {
              reassignToShop.mutate({
                ...payload,
                outlet: reassignOptions.value,
              });
              return;
            }
            if (deliveryStatus.updateType === 'delivery') {
              updateDeliveryStatus.mutate({
                ...payload,
                status_by: 'MERCHANT',
                status: deliveryStatus.value,
              });
            } else {
              updateOrderStatus.mutate({
                ...payload,
                status: deliveryStatus.value,
              });
            }
          }}
          disabled={
            updateDeliveryStatus.isLoading ||
            updateOrderStatus.isLoading ||
            assignRider.isLoading ||
            reassignToShop.isLoading
          }>
          {updateDeliveryStatus.isLoading ||
          updateOrderStatus.isLoading ||
          assignRider.isLoading ||
          reassignToShop.isLoading
            ? 'Processing'
            : 'Update status'}
        </PrimaryButton>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 0,
  },
  containerStyle: {
    width: '65%',
    paddingVertical: 40,
  },
});

export default ChangeOrderStatusSheet;
