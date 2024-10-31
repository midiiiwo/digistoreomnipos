import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import { s } from 'react-native-wind';
import { SheetManager } from 'react-native-actions-sheet';
import Filter from '../../assets/icons/filter.svg';
import RouteFilterSheet from '../components/BottomSheets/RouteFilterSheet';
import { useSelector } from 'react-redux';
import { useGetStoreDeliveryConfig } from '../hooks/useGetStoreDeliveryConfig';

const ManageRoutes = () => {
  const [filterType, setFilterType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { data: deliveryConfig, refetch } = useGetStoreDeliveryConfig(user.user_merchant_id);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch(); // Triggers a refetch of the data
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    if (deliveryConfig?.data?.code === 200) {
      const deliveryType = deliveryConfig.data.message.delivery_type;
      setFilterType(deliveryType);
    } else {
      console.error("Error fetching delivery config:", deliveryConfig?.data?.code);
    }
  }, [deliveryConfig]);

  const renderContent = () => {
    switch (filterType) {
      case 'LOCATION_BASED':
        return <Text style={styles.contentText}>Hello Location</Text>;
      case 'DISTANCE_BASED':
        return <Text style={styles.contentText}>Hello Distance</Text>;
      case 'DIGISTORE':
        return (
          <View style={styles.digistoreContainer}>
            <Image
              style={styles.digistoreImage}
              source={require('../../assets/images/food-delivery.png')}
            />
            <Text style={styles.digistoreText}>DIGISTORE DELIVERY</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Pressable style={s`mr-3 items-end`} onPress={() => SheetManager.show('routeFilter')}>
        <Filter stroke="#30475e" height={33} width={33} />
      </Pressable>
      <View style={styles.contentContainer}>{renderContent()}</View>
      <RouteFilterSheet sheetId="routeFilter" setFilterType={setFilterType} currentFilterType={filterType} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  contentContainer: { marginTop: 20, alignItems: 'center' },
  contentText: { fontSize: 20, color: '#30475E' },
  digistoreContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  digistoreImage: { height: 300, width: 300 },
  digistoreText: { marginTop: 30, fontSize: 40, fontWeight: 'bold', color: '#006400' },
});

export default ManageRoutes;
