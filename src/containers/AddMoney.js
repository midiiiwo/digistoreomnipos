/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import PaypointVendorCard from '../components/PaypointVendorCard';
import { InternetImages } from '../utils/internetOptions';
import { SheetManager } from 'react-native-actions-sheet';
import { AirtimeOptions } from '../utils/AirtimeOptions';
import { useSelector } from 'react-redux';
import RadioButton from '../components/RadioButton';
import { RadioButtonProvider } from '../context/RadioButtonContext';
import Verified from '../../assets/icons/verified.svg';
import { useGetAccountList } from '../hooks/useGetAccountList';
import Loading from '../components/Loading';
import Bin from '../../assets/icons/bin.svg';
import { useDeleteWalletAccount } from '../hooks/useDeleteWalletAccount';
import { useQueryClient } from 'react-query';
import { useToast } from 'react-native-toast-notifications';
import { useAddWallet } from '../hooks/useAddWallet';
import moment from 'moment';
import { RefreshControl } from 'react-native';
import DeleteDialog from '../components/DeleteDialog';

const AccountCard = ({
  number,
  network,
  idx,
  verified,
  networkCode,
  navigation,
}) => {
  const client = useQueryClient();
  const [deleteStatus, setDeleteStatus] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const toast = useToast();
  const { mutate } = useDeleteWalletAccount(i => {
    setDeleteStatus(i);
    client.invalidateQueries('account-list');
  });

  React.useEffect(() => {
    if (deleteStatus) {
      toast.show(deleteStatus.message, { placement: 'top' });
      setDeleteStatus(null);
    }
  }, [deleteStatus, toast]);
  const { user } = useSelector(state => state.auth);
  // const { mutate: addWallet } = useAddWallet();
  return (
    <Pressable
      onPress={() => {
        if (verified !== 'YES') {
          // const mod_date = moment().format('YYYY-MM-DD h:mm:ss');
          // addWallet({
          //   account_no: user.user_merchant_account,
          //   topup_network: networkCode,
          //   topup_number: number,
          //   mod_date: mod_date,
          //   mod_by: user.login,
          // });
          navigation.navigate('Verify Account', { number });
          return;
        }
        SheetManager.show('addMoneyAmount', {
          payload: { network, number, networkCode, navigation },
        });
      }}
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
      }}>
      {network === 'MTN Mobile Money' ? (
        <Image
          source={require('../../assets/images/mtn-momo.png')}
          style={{
            height: 45,
            width: 45,
            borderRadius: 8,
            marginRight: 16,
            marginLeft: 8,
          }}
        />
      ) : network === 'Vodafone Cash' ? (
        <Image
          source={require('../../assets/images/voda-cash.png')}
          style={{
            height: 45,
            width: 45,
            borderRadius: 8,
            marginRight: 16,
            marginLeft: 8,
          }}
        />
      ) : network === 'Tigo Cash' ? (
        <Image
          source={require('../../assets/images/tigo.png')}
          style={{
            height: 45,
            width: 45,
            borderRadius: 8,
            marginRight: 16,
            marginLeft: 8,
          }}
        />
      ) : (
        <Image
          source={require('../../assets/images/AirtelTigo-Money.jpeg')}
          style={{
            height: 45,
            width: 45,
            borderRadius: 8,
            marginRight: 16,
            marginLeft: 8,
          }}
        />
      )}
      <View style={{ justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#30475e',
              fontSize: 15,
              justifyContent: 'center',
              marginRight: 2,
            }}>
            {number}
          </Text>
          {verified === 'YES' && <Verified height={15} width={15} />}
        </View>

        <Text
          style={{
            fontFamily: 'SFProDisplay-Regular',
            color: '#6B728E',
            fontSize: 14,
          }}>
          {network}
        </Text>
      </View>
      <Pressable
        style={{ marginLeft: 'auto', marginRight: 16 }}
        onPress={() => {
          // toast.show(`Deleting wallet ${number}`);
          setVisible(true);
        }}>
        <Bin />
        <DeleteDialog
          visible={visible}
          handleCancel={() => setVisible(false)}
          handleSuccess={() => {
            mutate({
              user_merchant_account: user.user_merchant_account,
              mobileNumber: number,
            });
          }}
          title={'Do you want to delete this wallet?'}
          prompt="This process is irreversible"
        />
      </Pressable>
    </Pressable>
  );
};

const mapPaymentChannelToName = {
  MTNMM: 'MTN Mobile Money',
  VODAC: 'Vodafone Cash',
  ARTLM: 'AirtelTigo Money',
  TIGOC: 'Tigo Cash',
};

const AddMoney = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading, refetch, isRefetching } = useGetAccountList(
    user.user_merchant_account,
  );

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loading />;
  }

  if (
    data &&
    data.data &&
    data.data.data &&
    data.data.data.filter(i => i !== null).length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text
          style={{ fontFamily: 'Lato-Bold', fontSize: 18, color: '#30475e' }}>
          You have no wallet
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Medium',
            fontSize: 15,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your first wallet
        </Text>
        <Pressable
          style={[
            styles.btn,
            {
              marginTop: 14,
              backgroundColor: '#rgba(25, 66, 216, 0.9)',
            },
          ]}
          onPress={async () => {
            // SheetManager.show('addWallet', { payload: { navigation } });
            navigation.navigate('Add Wallet');
          }}>
          <Text style={styles.signin}>Create Wallet</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <View style={{ width: '100%' }}>
        {/* <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter-SemiBold',
            color: '#30475e',
            textAlign: 'center',
            marginVertical: 4,
          }}>
          Select Wallet
        </Text> */}
        <Pressable
          onPress={() =>
            // SheetManager.show('addWallet', { payload: { navigation } })
            navigation.navigate('Add Wallet')
          }
          style={{
            marginLeft: 'auto',
            marginRight: 16,
            padding: 4,
            marginBottom: 12,
            marginTop: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 16,
              color: '#1942D8',
            }}>
            Add New Wallet
          </Text>
        </Pressable>
      </View>
      <RadioButtonProvider>
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={() => refetch()}
              refreshing={isRefetching}
            />
          }
          data={data && data.data && data.data.data}
          renderItem={({ item, index }) => {
            return (
              <AccountCard
                number={item.Number}
                network={mapPaymentChannelToName[item.Network]}
                idx={index + 1}
                verified={item.Verified}
                networkCode={item.Network}
                navigation={navigation}
              />
            );
          }}
          keyExtractor={item => item.Number}
          ItemSeparatorComponent={() => (
            <View
              style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.5 }}
            />
          )}
        />
      </RadioButtonProvider>
    </View>
  );
};

export default AddMoney;

const styles = StyleSheet.create({
  main: {
    // alignItems: 'center',
    paddingHorizontal: 12,
    flex: 1,
    backgroundColor: '#fff',
  },
  flatgrid: {
    marginVertical: 12,
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
});
