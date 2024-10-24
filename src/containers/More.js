import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import Ticket from '../../assets/icons/ticket.svg';
import { useNavigation } from '@react-navigation/native';
// import { Toast, ALERT_TYPE } from 'react-native-alert-notification';

const More = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.main}>
      <ScrollView>
        <Pressable
          style={styles.item}
          onPress={() => {
            navigation.navigate('Tickets');
          }}>
          <Ticket height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Events & Tickets</Text>
            <Text style={styles.caption}>Manage events and tickets</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemHeader: {
    fontSize: 15,
    color: '#30475e',
    fontFamily: 'ReadexPro-Medium',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 5,

    paddingHorizontal: 22,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  caption: {
    fontSize: 13,
    color: '#748DA6',
    fontFamily: 'ReadexPro-Regular',
  },
  wrapper: {
    width: '85%',
    marginLeft: 13,
  },
});
