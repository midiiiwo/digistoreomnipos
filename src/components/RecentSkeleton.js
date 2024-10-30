/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Skeleton } from '@rneui/themed';

const RecentCardSkeleton = ({ item, navigation }) => {
  return (
    <View style={styles.recentCard}>
      <Skeleton animation="wave" style={styles.img} />
      <View style={styles.details}>
        <Skeleton animation="wave" style={styles.name} />
        <Skeleton animation="wave" style={styles.name} />
      </View>
      <View
        style={{
          marginRight: 6,
          marginLeft: 'auto',
          width: '15%',
        }}>
        <Skeleton animation="wave" style={styles.transactAmount} />
        <Skeleton animation="wave" style={styles.transactAmount} />
      </View>
    </View>
  );
};

export default RecentCardSkeleton;

const styles = StyleSheet.create({
  img: {
    height: 45,
    width: 45,
    borderRadius: 4,
  },
  recentsWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  recentCard: {
    width: '100%',
    // borderColor: '#ddd',
    // borderWidth: 0.3,
    padding: 10,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  details: {
    marginLeft: 16,
    width: '54%',
  },
  transactAmount: {
    height: 18,
    marginVertical: 2,
  },
  name: {
    height: 18,
    marginVertical: 1.5,
    // width: '50%',
  },
});
