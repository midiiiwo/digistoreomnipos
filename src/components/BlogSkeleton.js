/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import { Skeleton } from '@rneui/themed';

const BlogSkeleton = ({ item, navigation }) => {
  return (
    <View style={styles.recentCard}>
      <Skeleton animation="wave" style={styles.img} />
      <View style={{ marginTop: 8 }}>
        <Skeleton animation="wave" style={styles.excerpts} />
        <Skeleton animation="wave" style={styles.excerpts} />
      </View>
      <View
        style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton animation="wave" style={styles.date} />
        <Skeleton animation="wave" style={styles.share} />
      </View>
    </View>
  );
};

export default BlogSkeleton;

const styles = StyleSheet.create({
  recentCard: {
    height: '100%',
    width: Dimensions.get('window').width * 0.24,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginRight: 12,
    borderColor: '#ddd',
    borderWidth: 0.5,
  },
  img: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  excerpts: {
    height: 20,
    // marginHorizontal: 12,
    marginTop: 12,
    width: '78%',
    marginLeft: 10,
    borderRadius: 4,
  },
  date: {
    width: '15%',
    marginLeft: 10,
    borderRadius: 4,
    height: 16,
  },
  share: {
    height: 25,
    width: 25,
    borderRadius: 30,
    marginLeft: 'auto',
    marginRight: 14,
  },
});
