/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  InteractionManager,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import CaretRight from '../../../assets/icons/cart-right.svg';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

function CartOptionsSheet(props) {
  function handlePress(cb) {
    SheetManager.hide('cartOptions');
    cb();
  }
  const { resetCart } = useActionCreator();
  const { channel } = useSelector(state => state.quickSale);
  const navigation = useNavigation();
  const deliveryNext = React.useRef(false);
  const noteNext = React.useRef(false);
  const deliveryNoteNext = React.useRef(false);
  const channelNext = React.useRef(false);
  const { user } = useSelector(state => state.auth);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      openAnimationConfig={{ bounciness: 0 }}
      // indicatorStyle={styles.indicatorStyle}
      onClose={() => {
        InteractionManager.runAfterInteractions(() => {
          if (deliveryNext.current) {
            SheetManager.show('delivery');
            deliveryNext.current = false;
            return;
          }
          if (noteNext.current) {
            SheetManager.show('note');
            noteNext.current = false;
            return;
          }
          if (channelNext.current) {
            SheetManager.show('channels');
            channelNext.current = false;
          }
          if (deliveryNoteNext.current) {
            SheetManager.show('deliveryNote');
            deliveryNoteNext.current = false;
            return;
          }
        });
      }}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>More options</Text>
        </View>
        <Pressable
          style={styles.channelType}
          onPress={() =>
            handlePress(() =>
              navigation.navigate('Add Discount', {
                type: 'inventory',
              }),
            )
          }>
          <Text style={styles.channelText}>Add discount</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() => handlePress(() => (deliveryNext.current = true))}>
          <Text style={styles.channelText}>Delivery</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() => handlePress(() => (noteNext.current = true))}>
          <Text style={styles.channelText}>Add order note</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        {user &&
          user.user_permissions &&
          !user.user_permissions.includes('ADDORDERDLVRDATE') && (
            <Pressable
              style={styles.channelType}
              onPress={() =>
                handlePress(() => (deliveryNoteNext.current = true))
              }>
              <Text style={styles.channelText}>Add delivery note</Text>
              <CaretRight style={styles.caret} />
            </Pressable>
          )}
        <Pressable
          style={styles.channelType}
          onPress={() =>
            handlePress(() =>
              props.payload.navigation.navigate('Quick Sale', {
                prev_screen: 'Cart',
              }),
            )
          }>
          <Text style={styles.channelText}>Add Non-Inventory item</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() =>
            handlePress(() => {
              // SheetManager.show('cartOptions');
              channelNext.current = true;
            })
          }>
          <Text style={styles.channelText}>Sales channel</Text>
          <Text> </Text>
          <Text style={[styles.channelText]}>{`(${channel})`}</Text>
          <CaretRight style={styles.caret} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() => handlePress(resetCart)}>
          <Text style={[styles.channelText, { color: '#E0144C' }]}>
            Clear cart
          </Text>
        </Pressable>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
    paddingBottom: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 16,
    color: '#30475E',
    letterSpacing: 0.2,
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
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
    borderBottomWidth: 0.3,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  channelText: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 15,
    color: '#30475e',
  },
  caret: {
    marginLeft: 'auto',
  },
});

export default CartOptionsSheet;
