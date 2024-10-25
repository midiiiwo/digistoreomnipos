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
import { useGetMerchantRiders } from '../../hooks/useGetMerchantRiders';

function ChangeOrderStatusSheet(props) {
  const client = useQueryClient();
  const [deliveryResponse, setDeliveryResponse] = React.useState();
  const { user, outlet } = useSelector(state => state.auth);

  const updateDeliveryStatus = useUpdateDeliveryStatus(i => {
    client.invalidateQueries('selected-order');
    client.invalidateQueries('all-orders');
    setDeliveryResponse(i);
  });
  const [reassignOptions, setReassignOptions] = React.useState();
  const [assignRiderState, setAssignRiderState] = React.useState();
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
    deliveryStatus?.value === 'REASSIGN',
  );

  const toast = useToast();

  const { item, config } = props.payload;

  const statusOptions = [];

  const { data: riders, isLoading: ridersLoading } = useGetMerchantRiders(
    user.merchant,
    outlet?.outlet_id,
  );

  if (
    item?.order_status === 'PAID' ||
    item?.order_status === 'PAYMENT_DEFERRED'
  ) {
    if (item.delivery_type === 'PICKUP') {
      statusOptions.push({
        value: 'PICKUP_READY',
        label: 'READY FOR PICKUP',
        updateType: 'order',
      });
    } else if (item.delivery_type === 'DELIVERY') {
      if (
        config?.option_delivery === 'MERCHANT' ||
        config?.option_delivery === 'MERCHANT-DIST'
      ) {
        if (item.delivery_outlet && item.delivery_outlet.length > 0) {
          console.log('herererere', item.delivery_rider);
          if (
            item.delivery_rider === null ||
            item.delivery_rider === '' ||
            item.delivery_rider === 'null'
          ) {
            console.log('herererere123', item.delivery_rider);
            statusOptions.push({
              value: 'ASSIGNRIDER',
              label: 'ASSIGN RIDER',
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
      SheetManager.hide('orderStatus');
      setDeliveryResponse(null);
    }
  }, [deliveryResponse, toast]);

  console.log(assignRiderState);

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
        <View style={{ marginVertical: 14 }}>
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
        </View>
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
        {!ridersLoading &&
          typeof riders?.data?.message !== 'string' &&
          riders?.data?.message &&
          deliveryStatus &&
          deliveryStatus.value === 'ASSIGNRIDER' && (
            <Picker
              value={assignRiderState}
              setValue={c => {
                setAssignRiderState(c);
              }}
              placeholder="Select Rider to assign order">
              {riders?.data?.message?.map(i => {
                if (!i) {
                  return;
                }

                return (
                  <RNPicker.Item
                    key={i.user_id}
                    label={i.name}
                    value={i.user_id}
                  />
                );
              })}
            </Picker>
          )}
        <PrimaryButton
          style={{ borderRadius: 4, marginTop: 12 }}
          handlePress={() => {
            const payload = {
              no: item.order_no,
              mod_by: user.login,
              merchant: user.merchant,
            };
            if (deliveryStatus.value === 'ASSIGNRIDER' && assignRiderState) {
              assignRider.mutate({ ...payload, rider: assignRiderState.value });
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
    marginHorizontal: 22,
  },
});

export default ChangeOrderStatusSheet;
