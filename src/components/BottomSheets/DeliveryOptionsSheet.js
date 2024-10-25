// /* eslint-disable react-native/no-inline-styles */
// import React from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
// import ActionSheet from 'react-native-actions-sheet';
// import { SheetManager } from 'react-native-actions-sheet';

// import CaretRight from '../../../assets/icons/cart-right.svg';
// import { useActionCreator } from '../../hooks/useActionCreator';

// function DeliveryOptions(props) {
//   const { setDelivery } = useActionCreator();
//   function handlePress(cb) {
//     SheetManager.hide('cartOptions');
//     cb();
//   }
//   const { resetCart } = useActionCreator();
//   return (
//     <ActionSheet
//       id={props.sheetId}
//       statusBarTranslucent={false}
//       drawUnderStatusBar={false}
//       gestureEnabled={true}
//       containerStyle={styles.containerStyle}
//       indicatorStyle={styles.indicatorStyle}
//       springOffset={50}
//       defaultOverlayOpacity={0.3}>
//       <View style={styles.main}>
//         <View style={{ flex: 1, marginTop: 80 }}>
//           <Text style={locationStyles.distance}>
//             Estimated distance: {deliveryOptions.distance}
//           </Text>
//           <FlatList
//             style={locationStyles.list}
//             data={deliveryOptions.pricingestimate}
//             keyExtractor={item => item.estimateId}
//             renderItem={({ item, index }) => {
//               return (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setDelivery({
//                       value: 'DELIVERY',
//                       meta: item.estimateName,
//                       price: item.price,
//                       label: 'Delivery',
//                     });
//                     SheetManager.hideAll();
//                   }}
//                   style={locationStyles.optionsWrapper}>
//                   <Text style={locationStyles.name}>
//                     {index + 1}. {item.estimateName}
//                   </Text>
//                   <Text style={locationStyles.price}>GH¢{item.price}</Text>
//                 </TouchableOpacity>
//               );
//             }}
//             ItemSeparatorComponent={() => (
//               <View style={locationStyles.separator} />
//             )}
//           />
//         </View>
//       </View>
//     </ActionSheet>
//   );
// }

// const locationStyles = StyleSheet.create({
//   separator: { borderBottomColor: '#ddd', borderBottomWidth: 0.5 },
//   input: {
//     borderRadius: 3,
//     borderWidth: 0.4,
//     borderColor: '#ddd',
//     paddingHorizontal: 18,
//     marginVertical: 18,
//   },
//   locationMain: {
//     paddingHorizontal: 16,
//     height: '100%',
//     paddingBottom: 16,
//   },
//   list: { marginBottom: 30 },
//   distance: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     marginBottom: 16,
//     color: '#30475E',
//     textAlign: 'center',
//   },
//   btn: {
//     borderRadius: 4,
//     marginBottom: 18,
//     marginTop: 'auto',
//   },
//   optionsWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   name: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#30475E',
//   },
//   price: {
//     marginLeft: 'auto',
//     marginRight: 16,
//     fontFamily: 'JetBrainsMono-Regular',
//     fontSize: 18,
//     color: '#1942D8',
//   },
// });

// const styles = StyleSheet.create({
//   containerStyle: {
//     marginBottom: 0,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderBottomColor: 'rgba(146, 169, 189, 0.5)',
//     borderBottomWidth: 0.3,
//   },
//   mainText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#30475E',
//     letterSpacing: -0.4,
//   },
//   done: {
//     fontFamily: 'Inter-SemiBold',
//     color: '#1942D8',
//     fontSize: 15,
//     letterSpacing: -0.8,
//   },
//   doneWrapper: {
//     position: 'absolute',
//     right: 22,
//     top: 12,
//   },
//   channelType: {
//     alignItems: 'center',
//     paddingVertical: 18,
//     borderBottomColor: 'rgba(146, 169, 189, 0.3)',
//     borderBottomWidth: 0.3,
//     paddingHorizontal: 18,
//     flexDirection: 'row',
//   },
//   channelText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#687980',
//   },
//   caret: {
//     marginLeft: 'auto',
//   },
// });

// export default DeliveryOptions;
