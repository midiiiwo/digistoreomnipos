import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { useGetMerchantOutlets } from '../hooks/useGetMerchantOutlets';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAddMerchantDeliveryWindow } from '../hooks/useAddMerchantDeliveryWindow';
import { useNavigation } from '@react-navigation/native';


const AddDeliveryWindows = () => {
    const { user } = useSelector(state => state.auth);
    const { data } = useGetMerchantOutlets(user.user_merchant_id);
    const toast = useToast();
    const navigation = useNavigation();
    const client = useQueryClient();
    const outletData = data?.data?.data || [];
    const dataOutlet = [
        { value: "Select All", key: "all" },
        ...outletData
            .filter(outlet => outlet !== null)
            .map(outlet => ({ value: outlet.outlet_name, key: outlet.outlet_id })),
    ];

    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [deliveryWindows, setDeliveryWindows] = useState([{ day: '', start_time: '', end_time: '', cut_off_time: '' }]);
    const [timePicker, setTimePicker] = useState({ visible: false, routeIndex: null, field: '' });
    const [showError, setShowError] = useState(false);
    const addDeliveryWindow = useAddMerchantDeliveryWindow();





    const openTimePicker = (routeIndex, field) => {
        setTimePicker({ visible: true, routeIndex, field });
    };

    const closeTimePicker = () => {
        setTimePicker({ visible: false, routeIndex: null, field: '' });
    };

    // const handleTimeConfirm = (selectedTime) => {
    //     if (timePicker.routeIndex !== null && timePicker.field) {
    //         const formattedTime = new Date(selectedTime).toLocaleTimeString([], {
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             hour12: true,
    //           }); // Extract HH:mm
    //         const updatedWindows = [...deliveryWindows];
    //         updatedWindows[timePicker.routeIndex][timePicker.field] = formattedTime;
    //         setDeliveryWindows(updatedWindows);
    //     }
    //     closeTimePicker();
    // };

    const handleTimeConfirm = (selectedTime) => {
        if (timePicker.routeIndex !== null && timePicker.field) {
            const date = new Date(selectedTime);
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
    
            // Convert to 12-hour format
            hours = hours % 12 || 12;
    
            // Add leading zero for single-digit hours except for 10, 11, and 12
            const formattedHours = hours < 10 ? `0${hours}` : hours;
    
            const formattedTime = `${formattedHours}:${minutes} ${period}`;
    
            const updatedWindows = [...deliveryWindows];
            updatedWindows[timePicker.routeIndex][timePicker.field] = formattedTime;
            setDeliveryWindows(updatedWindows);
        }
        closeTimePicker();
    };
    

    const handleAddWindow = () => {
        setDeliveryWindows([...deliveryWindows, { day: '', start_time: '', end_time: '', cut_off_time: '' }]);
    };

    const handleRemoveWindow = (index) => {
        setDeliveryWindows(deliveryWindows.filter((_, i) => i !== index));
    };

    const handleWindowChange = (index, field, value) => {
        const updatedWindows = [...deliveryWindows];
        updatedWindows[index][field] = value;
        setDeliveryWindows(updatedWindows);
    };

    const handleSaveWindows = async () => {
        if (!selectedOutlet) {
            setShowError(true);
            toast.show('Please select an outlet.', { placement: 'top', type: 'danger' });
            return;
        }

        const requiredFields = ['day', 'start_time', 'end_time', 'cut_off_time'];

        if (!deliveryWindows.every(window => requiredFields.every(field => window[field]))) {
            setShowError(true);
            toast.show('Please fill out all fields for each delivery window.', { placement: 'top', type: 'danger' });
            return;
        }


        const formattedPayload = deliveryWindows.map(window => ({
            day: window.day,
            start_time: window.start_time, // Already formatted as HH:mm
            end_time: window.end_time,     // Already formatted as HH:mm
            cut_off_time: window.cut_off_time, // Already formatted as HH:mm
        }));

        // Prepare the payload
        const payload = {
            outlet_id: selectedOutlet.key,
            merchant_id: user.user_merchant_id,
            ...formattedPayload.reduce((acc, window, index) => {
                acc[`day`] = window.day;
                acc[`start_time`] = window.start_time;
                acc[`end_time`] = window.end_time;
                acc[`cutoff_time`] = window.cut_off_time;
                return acc;
            }, {}),
        };
        // const payload = {
        //     cutoff_time: "07:35 PM",
        //     day: "MON",
        //     end_time: "05:35 PM",
        //     merchant_id: "MER07000",
        //     outlet_id: "3334",
        //     start_time: "05:35 AM"
        // };

        try {
            const response = await addDeliveryWindow.mutateAsync(payload);
            if (response?.status === 200) {
                toast.show('Delivery windows added successfully.', { placement: 'top', type: 'success' });
                client.invalidateQueries(['merchantDeliveryWindows']);
                navigation.goBack();
            } else {
                toast.show(`Error: ${response?.message}`, { placement: 'top', type: 'danger' });
                console.log(response.status,"fuckkk")
            }
        } catch (error) {
            toast.show('An error occurred while adding delivery windows.', { placement: 'top', type: 'danger' });
            console.error('Error during API call:', error);
        }

        
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={styles.main}>
                <SelectList
                    setSelected={(key) => setSelectedOutlet(dataOutlet.find(outlet => outlet.key === key))}
                    data={dataOutlet}
                    save="key"
                />
                {deliveryWindows.map((window, index) => (
                    <View key={index} style={styles.windowRow}>
                        <SelectList
                            setSelected={(value) => handleWindowChange(index, 'day', value)}
                            data={[
                                { value: 'Monday', key: 'MON'},
                                { value: 'TUE', key:'TUE' },
                                { value: 'Wednesday', key: 'WED' },
                                { value: 'Thursday', key: 'THU' },
                                { value: 'Friday', key: 'FRI' },
                                { value: 'Saturday', key: 'SAT' },
                                { value: 'Sunday', key: 'SUN' },
                            ]}
                            placeholder="Select Day"
                            boxStyles={styles.dropdown}
                        />
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
                                {window[field]
                                 ? window[field] // Already formatted as "HH:mm AM/PM"
                                    : 'Select Time'}

                                </Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.actions}>
                            <Icon
                                name="delete"
                                size={32}
                                color="#900"
                                onPress={() => handleRemoveWindow(index)}
                                style={styles.icon}
                            />
                            <Icon
                                name="pluscircleo"
                                size={32}
                                color="rgba(25, 66, 216, 0.9)"
                                onPress={handleAddWindow}
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
                <PrimaryButton style={styles.btn} handlePress={handleSaveWindows}>
                    <Text>Save Delivery Windows</Text>
                </PrimaryButton>
            </View>
        </View>
    );
};

export default AddDeliveryWindows;

const styles = StyleSheet.create({
    main: {
        paddingHorizontal: 16,
        marginBottom: 20,
        marginTop: 10,
    },
    windowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dropdown: {
        flex: 1,
        marginHorizontal: 4,
        height: 50,
        justifyContent: 'center',
    },
    timeField: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 4,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
        color: '#333',
    },
    timeText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
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
        backgroundColor : '#fff',
        paddingVertical: 12,
        borderTopColor: '#ddd',
        borderTopWidth: 0.6,
    },
    btn: {
        borderRadius: 4,
        width: '90%',
    },
});