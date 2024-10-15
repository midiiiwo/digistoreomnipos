/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  InteractionManager,
  Dimensions,
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
  const channelNext = React.useRef(false);
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
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
          <CaretRight style={styles.caret} height={16} width={16} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() => handlePress(() => (deliveryNext.current = true))}>
          <Text style={styles.channelText}>Delivery</Text>
          <CaretRight style={styles.caret} height={16} width={16} />
        </Pressable>
        <Pressable
          style={styles.channelType}
          onPress={() => handlePress(() => (noteNext.current = true))}>
          <Text style={styles.channelText}>Add note</Text>
          <CaretRight style={styles.caret} height={16} width={16} />
        </Pressable>
        {/* <Pressable
          style={styles.channelType}
          onPress={() =>
            handlePress(() =>
              props.payload.navigation.navigate('Quick Sale', {
                prev_screen: 'Cart',
              }),
            )
          }>
          <Text style={styles.channelText}>Add Non-Inventory item</Text>
          <CaretRight style={styles.caret} height={16} width={16} />
        </Pressable> */}
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
          <CaretRight style={styles.caret} height={16} width={16} />
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
    width: Dimensions.get('window').width * 0.5,
    // paddingHorizontal:
  },
  main: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 20,
    color: '#30475E',
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
    paddingVertical: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.3,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  channelText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 18,
    color: '#3C4959',
    letterSpacing: 0.3,
  },
  caret: {
    marginLeft: 'auto',
    height: 12,
    width: 12,
  },
});

export default CartOptionsSheet;
