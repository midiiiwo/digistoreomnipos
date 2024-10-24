/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { useGetTicketDetails } from '../hooks/useGetTicketDetails';
import { ShadowedView } from 'react-native-fast-shadow';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';

const DetailItem = ({ detailName, detailValue }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomColor: '#BEBEBE',
        borderBottomWidth: 1.2,
        borderStyle: 'dashed',
      }}>
      <Text
        style={{
          fontFamily: 'SFProDisplay-Medium',
          color: '#B0B0B0',
          fontSize: 15.6,
        }}>
        {detailName}
      </Text>
      <Text
        style={{
          fontFamily: 'SFProDisplay-Medium',
          color: '#040D12',
          fontSize: 15.5,
          marginLeft: 'auto',
          maxWidth: '70%',
        }}>
        {detailValue}
      </Text>
    </View>
  );
};

const TicketDetails = ({ route }) => {
  const { id } = route && route.params;
  const { isLoading, data } = useGetTicketDetails(id);
  const navigation = useNavigation();

  if (isLoading) {
    return <Loading />;
  }

  const ticket = (data && data.data && data.data.data) || {};

  return (
    <View style={styles.main}>
      <View
        style={{
          height: Dimensions.get('window').height * 0.2,
          width: '100%',
          backgroundColor: '#2268BD',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: Dimensions.get('window').height * 0.01,
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('Edit Event Ticket', {
                ticket,
              });
            }}
            style={{
              backgroundColor: 'rgba(225, 225, 225, 0.3)',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 4,
            }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#fff',
                fontSize: 16,
              }}>
              Modify Ticket
            </Text>
          </Pressable>
          <View style={{ marginHorizontal: 4 }} />
          <Pressable
            style={{
              backgroundColor: 'rgba(225, 225, 225, 0.3)',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 4,
            }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#fff',
                fontSize: 16,
              }}>
              Delete Ticket
            </Text>
          </Pressable>
        </View>
      </View>
      <ShadowedView
        style={{
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          position: 'absolute',
          top: Dimensions.get('window').height * 0.1,
          alignSelf: 'center',
          borderRadius: 10,
        }}>
        <View
          style={{
            height: Dimensions.get('window').height * 0.79,
            borderRadius: 10,
          }}>
          <ScrollView
            style={{ flex: 1, borderRadius: 10 }}
            contentContainerStyle={{
              borderRadius: 10,
            }}>
            <View
              style={{
                width: Dimensions.get('window').width * 0.92,
                paddingHorizontal: 16,
                paddingVertical: 22,
                borderRadius: 10,
                backgroundColor: '#fff',
              }}>
              <DetailItem
                detailName="Ticket Name"
                detailValue={ticket && ticket.ticket_name}
              />
              <DetailItem
                detailName="Ticket Code"
                detailValue={ticket && ticket.ticket_code}
              />
              <DetailItem
                detailName="Status"
                detailValue={ticket && ticket.ticket_status}
              />
              <DetailItem
                detailName="Rate"
                detailValue={ticket && ticket.ticket_rate}
              />
              <DetailItem
                detailName="Unit"
                detailValue={ticket && ticket.ticket_unit}
              />
              <DetailItem
                detailName="Total Qty"
                detailValue={ticket && ticket.ticket_qty}
              />
              <DetailItem
                detailName="Sold Qty"
                detailValue={ticket.ticket_counter}
              />
              <DetailItem
                detailName="Remaining Qty"
                detailValue={ticket.ticket_remaining}
              />
              <DetailItem
                detailName="Discount Code"
                detailValue={ticket.ticket_discount_coupon}
              />
              <DetailItem
                detailName="Discount Rate"
                detailValue={ticket.ticket_discount_rate}
              />
              <DetailItem detailName="USSD" detailValue={ticket.ticket_ussd} />
              <DetailItem
                detailName="Start Date"
                detailValue={ticket.ticket_startdate}
              />
              <DetailItem
                detailName="Start Time"
                detailValue={ticket.ticket_starttime}
              />
              <DetailItem
                detailName="Venue"
                detailValue={ticket.ticket_venue}
              />
              <DetailItem
                detailName="Description"
                detailValue={ticket.ticket_description}
              />
            </View>
          </ScrollView>
        </View>
      </ShadowedView>
    </View>
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
