/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Timeline from 'react-native-timeline-flatlist';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useGetCurrentActivationStep } from '../hooks/useGetCurrentActivationStep';
import { useSelector } from 'react-redux';
import { useGetPreactiveState } from '../hooks/useGetPreactiveState';
import Loading from '../components/Loading';
import { useToast } from 'react-native-toast-notifications';
import PrimaryButton from '../components/PrimaryButton';
import { useRequestActivation } from '../hooks/useRequestActivation';
import { FAB } from 'react-native-paper';
import Help from '../../assets/icons/help.svg';
import { SheetManager } from 'react-native-actions-sheet';
import KycInfoModal from '../components/Modals/KycInfoModal';

const ActivationType = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetCurrentActivationStep(user.merchant);
  const toast = useToast();
  const [activationStatus, setActivationStatus] = React.useState();
  const [dialog, setDialog] = React.useState(false);

  const { isLoading: activationLoading, mutate } =
    useRequestActivation(setActivationStatus);

  React.useEffect(() => {
    if (activationStatus) {
      toast.show(activationStatus.message, { placement: 'top' });
      setActivationStatus(null);
    }
  }, [toast, activationStatus]);

  if (isLoading) {
    return <Loading />;
  }
  const step =
    data && data.data && data.data.data && data.data.data.account_setup_step;
  const d = [
    {
      title: 'Personal Information',
      description:
        'Tell us a little about yourself in order to verify your identity',
      icon:
        step == 1 ||
        step == 5 ||
        step == 2 ||
        step == 6 ||
        step == 3 ||
        step == 7 ||
        step == 8
          ? require('../../assets/images/tick-circle.png')
          : require('../../assets/images/clock.png'),
    },
    {
      title: 'Business Information',
      description: 'Please tell us about your business and how you sell today',
      icon:
        step == 1 || step == 5
          ? require('../../assets/images/clock.png')
          : step == 2 || step == 6 || step == 3 || step == 7 || step == 8
          ? require('../../assets/images/tick-circle.png')
          : require('../../assets/images/lock-circle.png'),
    },
    {
      title: 'Settlement Account',
      description:
        'Setup your bank account where you want your fund transfers to be sent',
      icon:
        step == 2 || step == 6
          ? require('../../assets/images/clock.png')
          : step == 3 || step == 7 || step == 8
          ? require('../../assets/images/tick-circle.png')
          : require('../../assets/images/lock-circle.png'),
    },
  ];
  return (
    <View style={styles.main}>
      <Text
        style={{
          fontFamily: 'SFProDisplay-Regular',
          color: '#30475e',
          width: '90%',
          // position: 'absolute',
          // bottom: Dimensions.get('window').height * 0.14,
          fontSize: 14.6,
          alignSelf: 'center',
          textAlign: 'center',
          marginBottom: 6,
        }}>
        Please tell us a little more about yourself, your business and provide a
        bank / mobile money account to activate your payment account. Click on
        the Request Activation button below once completed
      </Text>
      <Timeline
        lineColor="#30475e"
        innerCircle="icon"
        data={d}
        titleStyle={styles.title}
        eventContainerStyle={styles.rowContainerStyle}
        descriptionStyle={styles.descriptionStyle}
        detailContainerStyle={styles.detailContainerStyle}
        listViewStyle={styles.list}
        lineWidth={1}
        circleSize={20}
        circleColor="#fff"
        columnFormat="single-column-left"
        eventDetailStyle={{
          backgroundColor: '#537FE7',
          borderRadius: 6,
          marginVertical: 12,
          marginTop: 0,
          padding: 12,
          paddingHorizontal: 14,
        }}
        // circleColor="#fff"

        onEventPress={e => {
          // console.log('ppppppppppp', e);
          switch (e.title) {
            case 'Personal Information':
              navigation.navigate(e.title);
              break;
            case 'Business Information':
              if (
                !(
                  step == 1 ||
                  step == 5 ||
                  step == 2 ||
                  step == 6 ||
                  step == 3 ||
                  step == 7 ||
                  step == 8
                )
              ) {
                toast.show('Please complete personal information first', {
                  placement: 'top',
                });
                break;
              }
              navigation.navigate(e.title);
              break;
            case 'Settlement Account':
              if (
                !(step == 3 || step == 2 || step == 6 || step == 7 || step == 8)
              ) {
                toast.show('Please complete business information first', {
                  placement: 'top',
                });
                break;
              }
              navigation.navigate(e.title);
              break;
            default:
              break;
          }
        }}
      />
      <Pressable
        onPress={() => {
          console.log('cccccccccccccccc');
          setDialog(true);
        }}
        style={{
          position: 'absolute',
          bottom: Dimensions.get('window').height * 0.11,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#7DCD82',

            fontSize: 16,

            textDecorationLine: 'underline',
          }}>
          Why is this information requested
        </Text>
      </Pressable>

      <View style={styles.btnWrapper}>
        <PrimaryButton
          disabled={
            step == 0 ||
            step == 1 ||
            step == 5 ||
            step == 2 ||
            step == 6 ||
            step == 7 ||
            step == 8
          }
          style={styles.btn}
          handlePress={() => {
            mutate({
              merchant_id: user.merchant,
              mod_by: user.login,
            });
          }}>
          {activationLoading
            ? 'Processing'
            : step == 7
            ? 'Activaton Pending Approval'
            : step == 8
            ? 'Account Activated'
            : 'Request Activation'}
        </PrimaryButton>
      </View>
      <FAB
        icon={props => <Help {...props} />}
        style={styles.fab}
        onPress={() => SheetManager.show('support')}
        mode="flat"
      />
      <KycInfoModal dialog={dialog} setDialog={setDialog} />
    </View>
  );
};

export default ActivationType;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 17,
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
    marginTop: -2.5,
  },
  descriptionStyle: {
    color: 'rgba(225,225,225, 0.7)',
    marginVertical: 14,
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14,
  },
  detailContainerStyle: {
    width: '80%',
  },
  list: {
    marginTop: 12,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Dimensions.get('window').height * 0.12,
    borderRadius: 35,
    backgroundColor: '#F3F3F3',
  },
});
