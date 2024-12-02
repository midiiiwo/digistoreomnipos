import React, { useState, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import { useAddMerchantDeliveryWindow } from '../hooks/useAddMerchantDeliveryWindow';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/AntDesign';
import PrimaryButton from '../components/PrimaryButton';

const AddWindow = () => {
    const { user } = useSelector(state => state.auth);
    const { data, refetch, isFetching } = useGetMerchantOutlets(user.user_merchant_id);
    const [saved, setSaved] = useState();
    const [showError, setShowError] = useState(false);
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const toast = useToast();
    const client = useQueryClient();
    const outletData = data?.data?.data || [];
    const dataOutlet = [
        { value: "Select All", key: "all" },
        ...outletData
            .filter(outlet => outlet !== null)
            .map(outlet => ({ value: outlet.outlet_name, key: outlet.outlet_id })),
    ];
    const [routes, setRoutes] = useState([
    { day: '', start_time: '', end_time: '', cut_off_time: '' },
  ]);
  const [timePicker, setTimePicker] = useState({
    visible: false,
    routeIndex: null,
    field: '',
  });

  const openTimePicker = (routeIndex, field) => {
      setTimePicker({ visible: true, routeIndex, field });
      
  };

  const closeTimePicker = () => {
    setTimePicker({ visible: false, routeIndex: null, field: '' });
  };

  const handleTimeConfirm = (selectedTime) => {
    if (timePicker.routeIndex !== null && timePicker.field) {
      const updatedRoutes = [...routes];
      updatedRoutes[timePicker.routeIndex][timePicker.field] =
        selectedTime.toISOString();
      setRoutes(updatedRoutes);
    }
    closeTimePicker();
  };

  const handleRouteChange = (index, field, value) => {
    const updatedRoutes = [...routes];
    updatedRoutes[index][field] = value;
    setRoutes(updatedRoutes);
  };

  const handleAddRoute = () => {
    setRoutes([...routes, { day: '', start_time: '', end_time: '', cut_off_time: '' }]);
  };

  const handleRemoveRoute = (index) => {
    setRoutes(routes.filter((_, i) => i !== index));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <ScrollView style={styles.main}>
          <SelectList
                    setSelected={(key) => setSelectedOutlet(dataOutlet.find(outlet => outlet.key === key))}
                    data={dataOutlet}
                    save="key"
              />
              <View style={{ marginBottom:10} } />
        {routes.map((route, index) => (
          <View key={index} style={styles.routeRow}>
            <View style={styles.field}>
              <SelectList
                setSelected={(value) => handleRouteChange(index, 'day', value)}
                data={[
                  { value: 'Monday', key: 'monday' },
                  { value: 'Tuesday', key: 'tuesday' },
                  { value: 'Wednesday', key: 'wednesday' },
                  { value: 'Thursday', key: 'thursday' },
                  { value: 'Friday', key: 'friday' },
                  { value: 'Saturday', key: 'saturday' },
                  { value: 'Sunday', key: 'sunday' },
                ]}
                placeholder="Select Day"
                boxStyles={styles.dropdown} // Custom styles
              />
            </View>

            {['start_time', 'end_time', 'cut_off_time'].map((field, fieldIndex) => (
              <TouchableOpacity
                key={fieldIndex}
                style={styles.timeField}
                onPress={() => openTimePicker(index, field)}
              >
                <Text style={styles.timeLabel}>
                  {field.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.timeText}>
                  {route[field]
                    ? new Date(route[field]).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Select Time'}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.actions}>
              <Icon
                name="delete"
                size={32}
                color="#900"
                onPress={() => handleRemoveRoute(index)}
                style={styles.icon}
              />
              <Icon
                name="pluscircleo"
                size={32}
                color="rgba(25, 66, 216, 0.9)"
                onPress={handleAddRoute}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <DateTimePickerModal
        isVisible={timePicker.visible}
        mode="time"
        is24Hour={true}
        onConfirm={handleTimeConfirm}
        onCancel={closeTimePicker}
      />

      <View style={styles.btnWrapper}>
        <PrimaryButton style={styles.btn}>
          <Text>Save Routes</Text>
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddWindow;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  field: {
    flex: 1,
    marginHorizontal: 4,
  },
  dropdown: {
    height: 50, // Match the height of time fields
    justifyContent: 'center',
  },
  timeField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    height: 50, // Ensure consistent height
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the label
    marginBottom: 4,
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center', // Center align the time text
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  icon: {
    marginHorizontal: 8,
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
});
