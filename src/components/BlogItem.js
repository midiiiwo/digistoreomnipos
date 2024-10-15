/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import React from 'react';

import ShareIcon from '../../assets/icons/share.svg';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Skeleton } from '@rneui/base';

const BlogItem = ({ imgUrl, excerpt, link, date }) => {
  const { data: imageData, isLoading } = useQuery(
    ['blog-posts-image', imgUrl],
    () => axios.get(imgUrl),
  );

  return (
    <Pressable style={styles.blogItem} onPress={() => Linking.openURL(link)}>
      {!isLoading && (
        <Image
          source={{
            uri:
              imageData &&
              imageData.data &&
              imageData.data[0] &&
              imageData.data[0].source_url,
          }}
          resizeMode="cover"
          style={styles.blogImage}
        />
      )}
      {isLoading && <Skeleton animation="wave" style={styles.img} />}
      <View style={{ paddingHorizontal: 12, marginTop: 7 }}>
        <Text style={styles.blogSubtitle} numberOfLines={3}>
          {excerpt}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 12,
          marginTop: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          borderTopColor: '#ddd',
          borderTopWidth: 0.3,
        }}>
        <Text
          style={[
            styles.blogSubtitle,
            {
              color: '#738598',
              fontSize: 15,
              fontFamily: 'SFProDisplay-Regular',
            },
          ]}>
          {date}
        </Text>
        <Pressable
          onPress={async () => {
            // await Share.open({
            //   title: 'Share Blog',
            //   url: link,
            // });
            Linking.openURL(link);
          }}
          style={{
            marginLeft: 'auto',
            padding: 6,
          }}>
          <ShareIcon stroke="#2F66F6" height={28} width={28} />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default BlogItem;

const styles = StyleSheet.create({
  blogItem: {
    // backgroundColor: 'red',
    height: '100%',
    width: Dimensions.get('window').width * 0.21,
    borderRadius: 6,
    borderColor: '#ddd',
    borderWidth: 0.5,
    paddingBottom: 4,
    // marginHorizontal: 8,
    marginRight: 20,
  },
  blogSubtitle: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#091D60',
    fontSize: 15,
    textAlign: 'left',
    lineHeight: 23,
    letterSpacing: 0.3,
    opacity: 1,
  },
  blogImage: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  img: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
