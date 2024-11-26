/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    FlatList,
    RefreshControl,
    Dimensions,
    Modal,
    Platform,
    TextInput

} from 'react-native';

import { useSelector } from 'react-redux';
// import Input from "../components/Input";
import { useGetMerchantDiscountDetails } from '../hooks/useGetMerchantDiscountDetails';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from "@react-navigation/native";
import { useDeleteMerchantDiscount } from '../hooks/useDeleteMerchantDiscount';
import { useQueryClient } from 'react-query';
import { useGetOnlineStoreDetails } from '../hooks/useGetOnlineStoreDetails';
import { useToast } from 'react-native-toast-notifications';
import { Swipeable } from 'react-native-gesture-handler';
import DeleteDialog from '../components/DeleteDialog';
import { useGetMerchantSelectedDiscountDetails } from '../hooks/useGetMerchantSelectedDiscountDetails';
import { Switch } from 'react-native-ui-lib';
import ShareIcon from '../../assets/icons/share1.svg';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Share from 'react-native-share';
import BackIcon from '../../assets/icons/arrow-back.svg';
import Filter from '../../assets/icons/filter.svg';
import Bin from '../../assets/icons/delcross';
import SearchIcon from '../../assets/icons/search.svg';



function ManageDiscounts(props) {
    const client = useQueryClient();
    const { user } = useSelector(state => state.auth);
    const { data, refetch, isFetching } = useGetMerchantDiscountDetails(
        user.merchant,
    );

    // console.log('hello', data?.data?.data)
    const navigation = useNavigation();
    const toast = useToast();
    const [filterType, setFilterType] = React.useState('All Discounts');
    const currentDeleteRef = React.useRef();
    const [isCoupon, setIsCoupon] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const swipeableRefs = React.useRef(new Map());
    const [searchQuery, setSearchQuery] = React.useState('');
    // const [sliderValue, setSliderValue] = React.useState(0);// State to track switch status
    const { data: onlineData, isLoading } = useGetOnlineStoreDetails(user.merchant);

    const toggleSwitch = () => setIsCoupon((previousState) => !previousState);

    const [visible, setVisible] = React.useState(false);

    const deleteMerchantDiscount = useDeleteMerchantDiscount(i => {
        if (i) {
            client.invalidateQueries('merchant-discount-details');
            // Show success toast in green
            toast.show(i.message, { placement: 'top', type: 'success', animationType: 'slide-in', style: { backgroundColor: 'green' } });
        }
    });

    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };


    const handleDelete = (discountId) => {
        currentDeleteRef.current = discountId;
        setVisible(true);
    };

    const confirmDelete = () => {
        deleteMerchantDiscount.mutate({
            discount_id: currentDeleteRef.current,
            mod_by: user.login, // This can be defined as needed
        });
        setVisible(false);
        currentDeleteRef.current = null;


    };

    const [activeSwipeable, setActiveSwipeable] = React.useState(null);

    const handleSwipeableOpen = (id) => {
        // Close any previously open Swipeable
        if (activeSwipeable && activeSwipeable !== id) {
            const previousRef = swipeableRefs.current.get(activeSwipeable);
            previousRef?.close();
        }
        setActiveSwipeable(id);
    };

    const handleSwipeableClose = (id) => {
        if (activeSwipeable === id) {
            setActiveSwipeable(null);
        }
    };

    console.log(user.login, "hoihoho")

    const filterOptions = [
        { id: '1', name: 'All Discounts' },
        { id: '2', name: 'Active Discounts' },
        { id: '3', name: 'Scheduled' },
        { id: '4', name: 'Deactivated Discounts' },
    ];

    // const discount_id = data.data

    // Filter data based on isCoupon value
    // const filteredData = data?.data?.data?.filter(item =>
    //     isCoupon ? item.discount_mode === "DISCOUNT CODE" : item.discount_mode === "AUTOMATIC"
    // );





    const shareDiscount = async (discountCode, discountDescription) => {
        const onlinestore = onlineData?.data?.data?.store_domain;

        try {
            const message = isCoupon
                ? `🎉 Redeem your ${discountDescription} coupon using code ${discountCode} at ${onlinestore}. Don't miss out!` // For coupon sharing
                : `🎉 Click the link below to unlock amazing savings on your next purchase! ${discountDescription}. Don't miss out on this fantastic opportunity to treat yourself! 👉 ${onlinestore} 👈 Hurry, this offer is valid for a limited time only! Shop now and enjoy the benefits of being a valued customer! 🛍️💖`; // For discount sharing

            const shareOptions = {
                title: 'Share Discount Code',
                message: message,
            };
            await Share.open(shareOptions);
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    console.log(isCoupon, "heoo")



    const [filter, setFilter] = React.useState('all');

    // State to hold the filter type

    // Function to handle filter selection
    const handleFilterSelect = (selectedFilter) => {
        setFilterType(selectedFilter); // Update the filter type
        SheetManager.hide('discount-filter'); // Hide the bottom sheet
    };



    const filteredData = data?.data?.data?.filter((item) => {
        return (
            (isCoupon ? item.discount_mode === "DISCOUNT CODE" : item.discount_mode === "AUTOMATIC") &&
            (item.discount_code.toLowerCase().includes(searchQuery)
                ||
                item.discount_description.toLowerCase().includes(searchQuery)
            )
        );
    });


    // Now filter the already filtered data based on the discount state
    const filteredsData = filteredData?.filter(item => {
        if (filterType === 'Active Discounts') return item?.discount_state === 'Active';
        if (filterType === 'Deactivated Discounts') return item?.discount_state === 'Deactivated';
        if (filterType === 'Scheduled') return item?.discount_state === 'Scheduled';
        return true; // Return all if 'All Discounts' is selected
    });

    // combinedData now only contains the relevant discounts based on both filters
    const combinedData = filteredsData;

    const renderRightActions = (discountCode, discountDescription) => {
        return (
            <Pressable
                style={styles.shareButton}
                onPress={() => {
                    shareDiscount(discountCode, discountDescription);
                    // swipeableRefs.current?.close(); // Close the swipeable
                }}
            >
                <ShareIcon stroke="#30475e" height={33} width={33} />
            </Pressable>
        );
    };

    const renderLeftActions = (discountId) => {
        return (
            <Pressable
                style={styles.deleteButton}
                onPress={() => {
                    handleDelete(discountId);
                    // swipeableRefs.current?.close();
                }}
            >
                <Bin stroke="#30475e" height={33} width={33} />
            </Pressable>
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            refetch(); // Refetch discount details when the screen is focused
        }, [])
    );

    return (
        <View style={styles.main} >
            <View style={styles.headerMain}>
                <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                    <BackIcon height={23} width={23} stroke="#21438F" />
                </Pressable>
                <View style={styles.segmentedControlWrapper}>
                    <SegmentedControl
                        values={['Discount', 'Coupon']}
                        selectedIndex={isCoupon ? 1 : 0}
                        onChange={(event) => setIsCoupon(event.nativeEvent.selectedSegmentIndex === 1)}
                        backgroundColor="rgba(96, 126, 170, 0.05)"
                        tintColor="rgba(25, 66, 216, 0.9)"
                        activeFontStyle={styles.activeText}
                        fontStyle={styles.inactiveText}
                        style={styles.arbitrary}
                        sliderStyle={{ borderRadius: 40 }}
                    />
                </View>
                <Pressable style={styles.filterIcon} onPress={() => setModalVisible(true)}>
                    <Filter stroke="#30475e" height={33} width={33} />
                </Pressable>
            </View>

            <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                    <SearchIcon style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={isCoupon ? "Search Coupons..." : "Search Discounts..."}
                        placeholderTextColor="#7B8FA1"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>


            <View style={{ paddingHorizontal: 22, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* <Text
                    style={{
                        fontFamily: 'ReadexPro-Medium',
                        fontSize: 22,
                        color: '#002',
                    }}>
                    Discounts
                </Text> */}

            </View>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                }
                contentContainerStyle={{
                    paddingBottom: Dimensions.get('window').height * 0.1,
                }}
                // data={data && data.data && data.data.data}
                data={combinedData}
                renderItem={({ item }) => {
                    // console.log(item, "heloooooooo")

                    if (!item) {
                        return;
                    }
                    return (
                        <Swipeable
                            ref={(ref) => {
                                if (ref) swipeableRefs.current.set(item.discount_id, ref);
                                else swipeableRefs.current.delete(item.discount_id);
                            }}
                            onSwipeableOpen={() => handleSwipeableOpen(item.discount_id)}
                            onSwipeableClose={() => handleSwipeableClose(item.discount_id)}
                            renderLeftActions={() => renderLeftActions(item.discount_id)}
                            renderRightActions={() => renderRightActions(item.discount_code, item.discount_description)}
                        >
                            {/* // <Drawer
                        //   rightItems={[
                        //     {
                        //       text: 'Delete',
                        //       background: 'red',
                        //       onPress: async () => {
                        //         currentDeleteRef.current = item.user_id;
                        //         setVisible(true);
                        //       },
                        //     },
                        //   ]}> */}

                            <Pressable
                                onPress={async () => {
                                    // navigation.navigate('Create Discount', { discount_id: item.discount_id });
                                    navigation.navigate(isCoupon ? 'Create Coupon' : 'Create Discount', { discount_id: item.discount_id });
                                }}
                                style={{
                                    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
                                    borderBottomWidth: 0.3,
                                    alignItems: 'center',
                                    paddingVertical: 18,
                                    paddingHorizontal: 18,
                                    flexDirection: 'row',
                                    backgroundColor: '#fff',
                                }}>
                                {/* {isCoupon && item.discount_mode === "DISCOUNT CODE" && (
                                    <View style={{ backgroundColor: '#fff', marginRight: 10, borderRadius: 100, height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                        <Pressable
                                            style={styles.shareButton}
                                            onPress={() => shareDiscount(item.discount_code)} // Share the specific discount code
                                        >
                                            <ShareIcon width={24} height={24} />
                                        </Pressable></View>
                                )} */}
                                <View style={{ maxWidth: '88%' }}>

                                    <Text style={styles.channelText}>{item.discount_code}</Text>
                                    <View style={{ width: "95%" }}><Text style={styles.address}>{item.discount_description}</Text></View>
                                    <Text style={styles.address}>{item.discount_duration}</Text>

                                </View>
                                <View style={[
                                    styles.caret,
                                    {
                                        backgroundColor:
                                            item.discount_state.toLowerCase() === 'deactivated'
                                                ? 'rgba(214, 19, 85, 0.1)' // Light red for deactivated
                                                : item.discount_state.toLowerCase() === 'active'
                                                    ? 'rgba(16, 161, 157, 0.1)' // Light green for active
                                                    : 'rgba(0, 122, 255, 0.1)', // Light blue for scheduled
                                        borderColor:
                                            item.discount_state.toLowerCase() === 'deactivated'
                                                ? '#D61355' // Red for deactivated
                                                : item.discount_state.toLowerCase() === 'active'
                                                    ? '#10A19D' // Green for active
                                                    : '#007AFF', // Blue for scheduled
                                        borderWidth: 0.6,
                                    },
                                ]}>
                                    <Text style={{
                                        fontFamily: 'ReadexPro-Medium',
                                        color:
                                            item.discount_state.toLowerCase() === 'deactivated'
                                                ? '#D61355' // Red for deactivated
                                                : item.discount_state.toLowerCase() === 'active'
                                                    ? '#10A19D' // Green for active
                                                    : '#007AFF', // Blue for scheduled
                                    }}>
                                        {item.discount_state}
                                    </Text>
                                </View>

                            </Pressable>
                        </Swipeable>
                    );
                }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', paddingBottom: 12, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 }}>
                            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 16, color: '#30475E' }}>Filter Discounts</Text>
                        </View>
                        <FlatList
                            data={filterOptions}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        setFilterType(item.name);
                                        setModalVisible(false);
                                    }}
                                    style={{ borderBottomWidth: 0.3, paddingVertical: 18, paddingHorizontal: 18, flexDirection: 'row' }}
                                >
                                    <Text style={{ fontFamily: 'Lato-Semibold', fontSize: 17, color: '#30475e' }}>{item.name}</Text>
                                </Pressable>
                            )}
                            keyExtractor={item => item.id}
                        />
                        {/* <Pressable onPress={() => setModalVisible(false)} style={{ borderBottomWidth: 0.3, paddingVertical: 18, paddingHorizontal: 18 }}>
                            <Text style={{ fontFamily: 'Lato-Semibold', fontSize: 17, color: '#30475e' }}>Close</Text>
                        </Pressable> */}
                    </View>
                </View>
            </Modal>

            <View style={styles.btnWrapper}>
                <PrimaryButton
                    style={styles.btn}
                    handlePress={() => {
                        navigation.navigate(isCoupon ? 'Create Coupon' : 'Create Discount');
                    }}>
                    {isCoupon ? 'Create Coupon ' : "Create Discount"}
                </PrimaryButton>
            </View>
            <DeleteDialog
                visible={visible}
                handleCancel={() => setVisible(false)}
                handleSuccess={confirmDelete} // Call confirmDelete when confirmed
                title="Do you want to delete this discount?"
                prompt="This process is irreversible"
            />


        </View>
    );
}




const styles = StyleSheet.create({
    containerStyle: {
        marginBottom: 0,
    },
    main: {

        paddingBottom: 12,
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {

        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 12,
        borderBottomColor: 'rgba(146, 169, 189, 0.5)',
        borderBottomWidth: 0.3,
    },
    mainText: {
        fontFamily: 'Lato-Bold',
        fontSize: 16,
        color: '#30475E',
        letterSpacing: -0.2,
    },

    channelText: {
        fontFamily: 'ReadexPro-Regular',
        fontSize: 15,
        color: '#002',
        marginBottom: 2,
    },
    address: {
        fontFamily: 'ReadexPro-Regular',
        fontSize: 13,
        color: '#7B8FA1',
    },
    caret: {
        marginLeft: 'auto',
        backgroundColor: 'red',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
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
    shareButton: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'gray',
        width: 100,
        height: '100%',
        justifyContent: 'center',
        // borderRadius: 20
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#D61355',
        width: 100,
        height: '100%',
        justifyContent: 'center',
    },
    headerMain: {
        marginTop: Platform.OS === 'ios' ? 50 : 0,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 24,
        paddingHorizontal: 18,
        paddingLeft: 22,
    },
    arbitrary: {
        height: 42,
        width: 220,
        borderRadius: 40,
    },
    segmentedControlWrapper: {
        marginRight: 'auto',
    },
    activeText: {
        fontSize: 15,
        color: '#fff',
        fontFamily: 'ReadexPro-Medium',
        fontWeight: '100',
        letterSpacing: 0.4,
    },
    inactiveText: {
        fontSize: 15,
        color: '#30475e',
        fontFamily: 'ReadexPro-Medium',
        fontWeight: '100',
        letterSpacing: 0.4,
    },
    headerText: {
        marginLeft: 'auto',
        marginRight: 14,
        color: '#1942D8',
        fontFamily: 'ReadexPro-Medium',
    },

    back: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 'auto',
    },
    searchBarContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        borderColor: "gray",
        borderWidth: 1,
        height: Platform.OS === 'ios' ? 50 : 'auto', // Adjust width for iOS
    },

    searchIcon: {
        marginRight: 10,
        color: '#7B8FA1', // Adjust as needed
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },

});

export default ManageDiscounts;
