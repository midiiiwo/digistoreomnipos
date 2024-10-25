/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  RefreshControl,
  Platform,
} from 'react-native';
import * as Tabs from 'react-native-collapsible-tab-view';
import Lottie from 'lottie-react-native';
import BarScanner from '../../assets/icons/barscanner.svg';
import Search from '../../assets/icons/search.svg';

import ButtonLargeBottom from '../components/ButtonLargeBottom';
import ButtonCancelBottom from '../components/ButtonCancelBottom';
import { useSelector } from 'react-redux';
import { useGetOutletCategories } from '../hooks/useGetOutletCategories';
import { useGetOutletProducts } from '../hooks/useGetOutletProducts';
import { useGetCategoryProducts } from '../hooks/useGetCategoryProducts';
import Flash from '../../assets/icons/flash.svg';
import { handleSearch } from '../utils/shared';
import Loading from '../components/Loading';
import { useActionCreator } from '../hooks/useActionCreator';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import CustomStatusBar from '../components/StatusBar';
import InvoiceProductCard from '../components/InvoiceProductCard';

const Viewer = ({
  refetchCategories,
  // isCategoryFetching,
  category,
  searchTerm,
}) => {
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const {
    data,
    isLoading,
    refetch,
    isFetching: isCategoryProductsFetching,
  } = useGetCategoryProducts(
    user.merchant,
    user.outlet,
    category.id,
    category.name !== 'All',
  );
  const {
    data: allProducts,
    isLoading: isAllProductsLoading,
    isFetching: isOutletProductsFetching,
    refetch: refetchOutletProducts,
  } = useGetOutletProducts(user.merchant, user.outlet);
  const renderAllItems = React.useCallback(({ item, index }) => {
    if (!item) {
      return;
    }

    return (
      <InvoiceProductCard
        item={item}
        hasProperties={item.product_has_property}
        hasPropertyVariants={item.product_has_property_variants}
        properties={item.product_properties}
        variants={item.product_properties_variants}
      />
    );
  }, []);

  const renderCategoryItems = React.useCallback(({ item, index }) => {
    if (!item) {
      return;
    }

    return (
      <InvoiceProductCard
        item={item}
        hasProperties={item.product_has_property}
        hasPropertyVariants={item.product_has_property_variants}
        properties={item.product_properties}
        variants={item.product_properties_variants}
      />
    );
  }, []);

  React.useEffect(() => {
    if (category.name !== 'All') {
      refetch();
    }
  }, [refetch, category.name]);

  if (isAllProductsLoading) {
    return <Loading />;
  }

  if (category.name !== 'All') {
    if (isLoading) {
      return <Loading />;
    }

    // if (data && data.data && data.data.data) {
    //   return (
    //     <View style={{ flex: 1, backgroundColor: 'red' }}>
    //       <Text>hello</Text>
    //     </View>
    //   );
    // }

    return (
      <FlashList
        estimatedItemSize={Dimensions.get('screen').width * 0.27}
        refreshControl={
          <RefreshControl
            refreshing={isCategoryProductsFetching}
            onRefresh={() => {
              refetch();
            }}
          />
        }
        keyExtractor={(item, index) => {
          if (!item) {
            return index;
          }
          return item.product_id;
        }}
        contentContainerStyle={styles.container}
        data={[
          ...handleSearch(
            searchTerm,
            (data && data.data && data.data.data) || [],
          ),
        ]}
        numColumns={3}
        renderItem={renderCategoryItems}
      />
    );
  }
  if (
    allProducts &&
    allProducts.data &&
    allProducts.data.data &&
    allProducts.data.data.filter(i => i != null).length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 16,
            color: '#30475e',
          }}>
          You have no products yet
        </Text>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 14,
            color: '#748DA6',
            marginTop: 10,
          }}>
          Create your first product
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
            navigation.navigate('Add Product');
          }}>
          <Text style={styles.signin}>Add Product</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <>
      <FlashList
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetchCategories();
              refetchOutletProducts();
            }}
            refreshing={isOutletProductsFetching}
          />
        }
        estimatedItemSize={Dimensions.get('screen').width * 0.27}
        keyExtractor={(item, index) => {
          if (!item) {
            return index;
          }
          return item.product_id;
        }}
        contentContainerStyle={styles.container}
        data={[
          ...handleSearch(
            searchTerm,
            (allProducts && allProducts.data && allProducts.data.data) || [],
          ),
        ]}
        numColumns={3}
        renderItem={renderAllItems}
      />
    </>
  );
};

const InvoiceInventory = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const { quickSaleInAction } = useSelector(state => state.quickSale);
  const { data, isLoading, refetch, isRefetching } = useGetOutletCategories(
    user.merchant,
    user.outlet,
  );
  const { cart } = useSelector(state => state.invoice);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { setQuickSaleInAction, resetInvoiceCart } = useActionCreator();

  const subTotal =
    cart &&
    cart.reduce((acc, curr) => {
      return acc + curr.amount * curr.quantity;
    }, 0);

  React.useEffect(() => {
    if (quickSaleInAction) {
      setQuickSaleInAction(false);
      resetInvoiceCart();
    }
  }, [quickSaleInAction, setQuickSaleInAction, resetInvoiceCart]);

  if (isLoading || istaxesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Lottie
          source={require('../lottie/95136-2-parallel-lines-animation.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  const categoryItems = ((data && data.data && data.data.data) || []).map(
    cat => {
      return {
        id: cat.category_id,
        name: cat.category_name,
      };
    },
  );

  const screens = [{ id: 'donotusethisid', name: 'All' }, ...categoryItems].map(
    cat => {
      return (
        <Tabs.Tab name={cat.name} key={cat.id}>
          <Tabs.Lazy>
            <Viewer
              navigation={navigation}
              category={cat}
              searchTerm={searchTerm.trim()}
              isCategoryFetching={isRefetching}
              refetchCategories={refetch}
            />
          </Tabs.Lazy>
        </Tabs.Tab>
      );
    },
  );

  return (
    <View style={styles.main}>
      {Platform.OS === 'android' && (
        <CustomStatusBar backgroundColor="#59C1BD" />
      )}
      <Tabs.Container
        lazy
        renderHeader={() => (
          <View style={styles.topIcons}>
            <Pressable style={styles.searchBox}>
              <Search
                stroke="#131517"
                height={20}
                width={20}
                style={{ marginLeft: 12 }}
              />
              <TextInput
                style={styles.search}
                placeholder="Search product"
                placeholderTextColor="#52555C"
                value={searchTerm}
                onChangeText={setSearchTerm}
                cursorColor="#131517"
              />
              <Pressable onPress={() => navigation.navigate('Cart Barcode')}>
                <BarScanner stroke="#30475e" height={25} width={25} />
              </Pressable>
            </Pressable>
            <View style={styles.viewSpace} />

            <Pressable
              style={{ marginRight: 8 }}
              onPress={() => {
                navigation.navigate('Invoice QuickSale', {
                  prev_screen: 'Invoice Inventory',
                });
              }}>
              <Flash stroke="#30475e" height={25} width={25} />
            </Pressable>
          </View>
        )}
        renderTabBar={props => (
          <Tabs.MaterialTabBar
            labelStyle={styles.labelStyle}
            {...props}
            style={styles.containerStyle}
            indicatorStyle={styles.indicatorStyle}
            tabStyle={styles.tabStyle}
            inactiveColor="#30475e"
            activeColor="#1942D8"
            scrollEnabled
          />
        )}>
        {screens}
      </Tabs.Container>
      <View style={styles.buttonWrapper}>
        <ButtonLargeBottom
          extraStyle={styles.btnlarge}
          width="80%"
          handlePress={() => navigation.goBack()}
          disabled={cart.length === 0}
          disabledColor="rgba(89, 193, 189, 1)"
          backgroundColor="#59C1BD">
          {cart.length} items - GHS{' '}
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(Number(subTotal))}
        </ButtonLargeBottom>
        <ButtonCancelBottom
          extraStyle={styles.btnlarge}
          handlePress={resetInvoiceCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewSpace: {
    width: 10,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingLeft: 15,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: 3,
    width: '80%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'ReadexPro-bold',
    fontSize: 15,
  },
  tabView: {
    flex: 1,
    marginTop: 4,
  },
  containerStyle: {
    marginHorizontal: 12,
    marginTop: 12,
  },
  labelStyle: {
    fontFamily: 'ReadexPro-Medium',
    textTransform: 'capitalize',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  indicatorStyle: {
    height: 3.5,
    borderRadius: 10,
    backgroundColor: '#1942D8',
    opacity: 0.8,
  },
  tabStyle: { marginHorizontal: 7 },
  topText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickSale: {
    marginRight: 'auto',
    fontFamily: 'Inter-Regular',
    marginLeft: 20,
    color: '#1942D8',
    marginTop: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    borderRadius: 54,
    backgroundColor: '#fff',
    height: 50,
    borderColor: '#DCDCDE',
    borderWidth: 1,
  },
  search: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15.4,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
    marginTop: 2,
  },
  searchBtn: {
    marginLeft: 'auto',
  },
  activeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontWeight: '100',
  },
  inactiveText: {
    fontSize: 14,
    color: '#748DA6',
    fontFamily: 'Inter-Regular',
  },
  arbitrary: { height: 42 },
  viewAll: {
    fontFamily: 'Inter-Regular',
    marginLeft: 'auto',
    marginRight: 20,
    color: '#1942D8',
    marginTop: 10,
  },
  viewAllWrapper: {
    marginLeft: 'auto',
  },
  grid: {
    marginVertical: 110,
    marginBottom: 60,
  },

  container: {
    paddingVertical: 120,
    paddingBottom: 70,
    paddingLeft: Dimensions.get('window').width * 0.028,
  },
  buttonWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    left: 0,
    bottom: 0,
    right: 0,
  },
  // btnlarge: { height: 65 },
});

export default InvoiceInventory;
