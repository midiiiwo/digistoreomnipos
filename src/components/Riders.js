import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Pressable,
    RefreshControl,
    Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGetMerchantRidersAll } from '../hooks/useGetMerchantRidersAll';
import Bin from '../../assets/icons/delcross';
import DeleteDialog from '../components/DeleteDialog';
import { useDeleteRider } from '../hooks/useDeleteRider';
import { useToast } from 'react-native-toast-notifications';
import { useQueryClient } from 'react-query';
import { FloatingButton } from 'react-native-ui-lib';

function Riders() {
    const { user, outlet } = useSelector(state => state.auth);
    const { data, refetch, isFetching } = useGetMerchantRidersAll(user.user_merchant_id, outlet.outlet_id);
    const [visible, setVisible] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState();
    const navigation = useNavigation();
    const { mutate } = useDeleteRider(setDeleteStatus);
    const toast = useToast();
    const client = useQueryClient();
    const idToDelete = useRef();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    useEffect(() => {
        if (deleteStatus) {
            if (deleteStatus.code === 200) {
                toast.show(deleteStatus.message, { placement: 'top', type: 'success' });
                client.invalidateQueries('merchant-riders');
                refetch();
            } else {
                toast.show(deleteStatus.message, { placement: 'top', type: 'danger' });
            }
            setDeleteStatus(null);
            idToDelete.current = null;
        }
    }, [toast, deleteStatus, client]);

    return (
        <View style={styles.main}>
            <FlatList
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                contentContainerStyle={{
                    paddingBottom: Dimensions.get('window').height * 0.1,
                }}
                data={data?.data?.message}
                keyExtractor={(item) => item?.user_id?.toString()}
                renderItem={({ item }) => {
                    if (!item) return null;

                    return (
                        <View style={styles.itemContainer}>
                            <View style={{ maxWidth: '88%' }}>
                                <Text style={styles.channelText}>{item.name}</Text>
                                <Text style={styles.address}>{item.telephone}</Text>
                            </View>
                            <Pressable
                                style={{ marginLeft: 'auto', marginRight: 8 }}
                                onPress={() => {
                                    setVisible(true);
                                    idToDelete.current = item.user_id;
                                }}
                            >
                                <Bin height={20} width={20} />
                            </Pressable>
                        </View>
                    );
                }}
            />

            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                {/* <PrimaryButton style={styles.btn} handlePress={() => navigation.navigate('Add Rider')}>
                    Add Rider
                </PrimaryButton> */}
                <FloatingButton
                    visible={true}
                    hideBackgroundOverlay
                    // bottomMargin={Dimensions.get('window').width * 0.18}

                    button={{
                        label: 'Add Rider',
                        onPress: () => {
                            navigation.navigate('Add Rider');
                        },

                        style: {
                            // marginLeft: 'auto',
                            // marginRight: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '50%',
                            backgroundColor: 'rgba(60, 121, 245, 1.0)',
                            marginBottom: Dimensions.get('window').width * 0.05,
                        },
                    }}
                />
            </View>

            <DeleteDialog
                visible={visible}
                handleCancel={() => setVisible(false)}
                handleSuccess={() => mutate({ user_id: idToDelete.current })}
                title="Do you want to delete this rider?"
                prompt="This process is irreversible"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, paddingHorizontal: 10, paddingTop: 16 },
    countText: { fontSize: 18, fontWeight: 'bold', color: '#1b2b34', marginBottom: 10 },
    channelText: { fontSize: 16, color: '#1b2b34', fontFamily: 'ReadexPro-Medium' },
    address: { color: '#304753', fontSize: 14 },
    btn: { backgroundColor: rgb(47, 102, 246, 0.5), width: 500, borderRadius: 30 },
    itemContainer: {
        borderBottomColor: 'rgba(146, 169, 189, 0.3)',
        borderBottomWidth: 0.3,
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
    },
    btnWrapper: {
        marginVertical: 24,
        marginHorizontal: 8,
        marginTop: 'auto',
    },
});

export default Riders;
