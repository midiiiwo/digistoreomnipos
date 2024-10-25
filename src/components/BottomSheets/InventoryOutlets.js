/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import Check from '../../../assets/icons/check-outline.svg';
import { useActionCreator } from '../../hooks/useActionCreator';

import { useGetMerchantOutlets } from '../../hooks/useGetMerchantOutlets';

function InventoryOutlet(props) {
  const { inventoryOutlet } = useSelector(state => state.products);
  const { setInventoryOutlet } = useActionCreator();
  function handleSelect(outlet) {
    setInventoryOutlet(outlet);
    SheetManager.hide('inventoryOutlet');
  }

  console.log('dgsgsgsg', inventoryOutlet);
  const { user } = useSelector(state => state.auth);
  const { data } = useGetMerchantOutlets(user.merchant);
  return (
    <ActionSheet
      id={props.sheetId}
      // statusBarTranslucent={false}
      // drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      openAnimationConfig={{ bounciness: 0 }}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Select Outlet</Text>
        </View>
        <ScrollView>
          {((data && data.data && data.data.data) || [])
            .filter(
              i =>
                i &&
                user.user_assigned_outlets &&
                user.user_assigned_outlets.includes(i.outlet_id),
            )
            .map(outlet => {
              if (outlet) {
                return (
                  <Pressable
                    key={outlet.outlet_id}
                    style={styles.channelType}
                    onPress={() => handleSelect(outlet)}>
                    <Text style={styles.channelText}>{outlet.outlet_name}</Text>
                    {outlet.outlet_id === inventoryOutlet.outlet_id && (
                      <Check
                        style={styles.caret}
                        height={24}
                        width={24}
                        stroke="#3C79F5"
                      />
                    )}
                  </Pressable>
                );
              }
            })}
        </ScrollView>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  // indicatorStyle: {
  //   display: 'none',
  // },
  caret: {
    marginLeft: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    color: '#30475E',
    letterSpacing: 0.3,
  },
  done: {
    fontFamily: 'Inter-SemiBold',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: -0.8,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  channelType: {
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 8,
  },
  channelText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16.4,
    color: '#30475E',
  },
});

export default InventoryOutlet;

