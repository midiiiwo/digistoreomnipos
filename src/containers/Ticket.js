/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import React from 'react';
// import { TabView, TabBar } from 'react-native-tab-view';
import EventList from './EventList';
import TicketValidate from './TicketValidate';

import { TabBar, TabView } from 'react-native-tab-view';
import TicketHistory from './TicketHistory';

const renderScene = ({ route }) => {
  switch (route.key) {
    case 'first':
      return <EventList />;
    case 'second':
      return <TicketValidate />;
    case 'third':
      return <TicketHistory />;
    default:
      return null;
  }
};

const Ticket = () => {
  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();
  const [routes] = React.useState([
    { key: 'first', title: 'Events' },
    { key: 'second', title: 'Validate' },
    { key: 'third', title: 'History' },
  ]);
  return (
    <View style={styles.main}>
      {/* <TicketValidate /> */}

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#fff', elevation: 1 }}
            activeColor="#000"
            labelStyle={{
              fontFamily: 'ReadexPro-Regular',
              fontSize: 15,
              color: '#002',
              textTransform: 'capitalize',
            }}
            indicatorStyle={{
              backgroundColor: '#2F66F6',
              borderRadius: 22,
              height: 3,
            }}
          />
        )}
      />
    </View>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
