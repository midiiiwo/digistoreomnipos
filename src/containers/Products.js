/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  Text,
} from 'react-native';
import * as Tabs from 'react-native-collapsible-tab-view';
import Lottie from 'lottie-react-native';
import AddCircle from '../../assets/icons/add-circle-dark.svg';
import Search from '../../assets/icons/search.svg';
// import FilterLines from '../../assets/icons/filtericons.svg';

import { useSelector } from 'react-redux';
import { handleSearch } from '../utils/shared';
import Loading from '../components/Loading';
import ProductInventoryCard from '../components/ProductInventoryCard';
import Categories from './Categories';
import { RefreshControl } from 'react-native';
import { useGetGlobalProducts } from '../hooks/useGetGlobalProducts';
import { useGetAllProductsCategories } from '../hooks/useGetAllProductsCategories';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { uniqBy } from 'lodash';
import PagerView from 'react-native-pager-view';
import { SheetManager } from 'react-native-actions-sheet';
import { useActionCreator } from '../hooks/useActionCreator';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Viewer = ({
  category,
  searchTerm,
  navigation,
  inventoryOutlet,
  setInventoryOutlet,
}) => {
  const { user } = useSelector(state => state.auth);
  const {
    data: allProducts,
    isLoading: isAllProductsLoading,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useGetGlobalProducts(
    user.merchant,
    (inventoryOutlet && inventoryOutlet.outlet_id) || 'ALL',
  );

  // React.useEffect(() => {
  //   refetchAll();
  // }, [inventoryOutlet, refetchAll]);

  const renderAllItems = React.useCallback(
    ({ item, index }) => {
      if (item.hasOwnProperty('type')) {
        return;
      }
      if (index === 0) {
        return (
          <ProductInventoryCard
            item={item}
            // setHeight={setHeight}
            // setWidth={setWidth}
            hasProperties={item.product_has_property}
            hasPropertyVariants={item.product_has_property_variants}
            properties={item.product_properties}
            variants={item.product_properties_variants}
            navigation={navigation}
            inventoryOutlet={inventoryOutlet}
            setInventoryOutlet={setInventoryOutlet}
          />
        );
      }
      return (
        <ProductInventoryCard
          item={item}
          hasProperties={item.product_has_property}
          hasPropertyVariants={item.product_has_property_variants}
          properties={item.product_properties}
          variants={item.product_properties_variants}
          navigation={navigation}
          inventoryOutlet={inventoryOutlet}
          setInventoryOutlet={setInventoryOutlet}
        />
      );
    },
    [navigation, inventoryOutlet, setInventoryOutlet],
  );

  const renderCategoryItems = React.useCallback(({ item, index }) => {
    if (item.hasOwnProperty('type')) {
      return;
    }
    if (index === 0) {
      return (
        <ProductInventoryCard
          item={item}
          // setHeight={setHeight}
          // setWidth={setWidth}
          hasProperties={item.product_has_property}
          hasPropertyVariants={item.product_has_property_variants}
          properties={item.product_properties}
          variants={item.product_properties_variants}
          inventoryOutlet={inventoryOutlet}
          setInventoryOutlet={setInventoryOutlet}
        />
      );
    }
    return (
      <ProductInventoryCard
        item={item}
        hasProperties={item.product_has_property}
        hasPropertyVariants={item.product_has_property_variants}
        properties={item.product_properties}
        variants={item.product_properties_variants}
        inventoryOutlet={inventoryOutlet}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAllProductsLoading) {
    return <Loading />;
  }

  if (category.name !== 'All') {
    if (isAllProductsLoading) {
      return <Loading />;
    }
    return (
      <><View style={{ flex: 1 }}>
        <FlashList
          estimatedItemSize={Dimensions.get('screen').width * 0.309}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingAll}
              onRefresh={() => {
                refetchAll();
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
              (allProducts?.data?.data || [])
                .filter(i => i != null)
                .filter(i => {
                  if (!i) {
                    return;
                  }
                  return i.product_category === category.name;
                }) || [],
            ),
          ]}
          numColumns={3}
          renderItem={renderCategoryItems}
          onScroll={({ nativeEvent }) => {
            // Hide outlet button if any scroll movement is detected
            if (nativeEvent.contentOffset.y > 0) {
              setShowOutletButton(false); // Hide the button on scroll
            } else {
              setShowOutletButton(true); // Show the button if scrolled back to the top
            }
          }}
          scrollEventThrottle={16}

        />
      </View>
      </>
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
          style={{ fontFamily: 'Lato-Bold', fontSize: 18, color: '#30475e' }}>
          You have no products yet
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Medium',
            fontSize: 15,
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
            refreshing={isRefetchingAll}
            onRefresh={() => {
              refetchAll();
            }}
          />
        }
        keyExtractor={(item, index) => {
          if (!item) {
            return index;
          }
          return item.product_id;
        }}
        estimatedItemSize={Dimensions.get('screen').width * 0.309}
        contentContainerStyle={styles.container}
        data={[
          ...handleSearch(
            searchTerm,
            (
              (allProducts && allProducts.data && allProducts.data.data) ||
              []
            ).filter(i => i != null) || [],
          ),
        ]}
        numColumns={3}
        renderItem={renderAllItems}
      />
    </>
  );
};

const ProductsView = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const { bottom } = useSafeAreaInsets();
  const { data, isLoading } = useGetAllProductsCategories(user.merchant);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { inventoryOutlet } = useSelector(state => state.products);
  const [showOutletButton, setShowOutletButton] = React.useState(true);
  const { setInventoryOutlet } = useActionCreator();
  if (isLoading) {
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
      if (!cat) {
        return;
      }
      return {
        id: cat.product_category_id,
        name: cat.product_category,
      };
    },
  );

  const screens = uniqBy(
    [{ id: 'donotusethisid', name: 'All' }, ...categoryItems],
    'name',
  ).map(cat => {
    if (!cat) {
      return;
    }
    return (
      <Tabs.Tab name={cat.name} key={cat.id}>
        <Tabs.Lazy>
          <Viewer
            navigation={navigation}
            category={cat}
            searchTerm={searchTerm.trim()}
            inventoryOutlet={inventoryOutlet}
            setInventoryOutlet={setInventoryOutlet}
          />
        </Tabs.Lazy>
      </Tabs.Tab>
    );
  });
  return (
    <>
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
                placeholderTextColor="#929AAB"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </Pressable>
            <View style={styles.viewSpace} />
            <Pressable
              style={{ marginHorizontal: 4 }}
              onPress={() => {
                if (!user.user_permissions.includes('ADDPROD')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade Needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Add Product');
              }}>
              <AddCircle />
            </Pressable>
            {/* <Pressable
            style={{ marginHorizontal: 6 }}
            onPress={() => {
              SheetManager.show('inventoryOutlet', {
                payload: { setInventoryOutlet, inventoryOutlet },
              });
            }}>
            <FilterLines />
          </Pressable> */}
          </View>
        )}
        renderTabBar={props => (
          <Tabs.MaterialTabBar
            labelStyle={styles.labelStyle}
            {...props}
            style={styles.containerStyle}
            indicatorStyle={styles.indicatorStyle}
            tabStyle={styles.tabStyle}
            inactiveColor="#3E4377"
            activeColor="#1942D8"
            scrollEnabled
          />
        )}>
        {screens}
      </Tabs.Container>
      {showOutletButton && (
        <Pressable
          onPress={() => {
            SheetManager.show('inventoryOutlet', {
              payload: { setInventoryOutlet, inventoryOutlet },
            });
          }}
          style={{
            backgroundColor: 'rgba(25, 66, 216, 0.9)',
            position: 'absolute',
            width: '50%',
            bottom: 6 + bottom,
            alignItems: 'center',
            borderRadius: 50,
            alignSelf: 'center',
          }}>
          <View style={{ paddingVertical: 14 }}>
            <Text style={{ fontFamily: 'ReadexPro-Medium', color: '#fff', fontSize: 15 }}>
              {inventoryOutlet && inventoryOutlet.outlet_name}
            </Text>
          </View>
        </Pressable>
      )}
    </>
  );
};

const Products = ({ navigation }) => {
  const { activeProductsTab } = useSelector(state => state.products);

  React.useEffect(() => {
    pagerRef.current.setPage(activeProductsTab);
  }, [activeProductsTab]);

  const pagerRef = React.useRef();

  return (
    <>
      {/* <StatusBar backgroundColor="#fff" barStyle={'dark-content'} /> */}
      <PagerView style={styles.main} initialPage={0} ref={pagerRef}>
        <View key={1} collapsable={false}>
          <ProductsView navigation={navigation} />
        </View>
        <View key={2} collapsable={false}>
          <Categories navigation={navigation} />
        </View>
      </PagerView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewSpace: {
    width: 8,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingLeft: 20,
    height: 52,
  },
  tabView: {
    flex: 1,
    marginTop: 4,
  },
  containerStyle: { marginHorizontal: 12, marginTop: 12 },
  labelStyle: {
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
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
  segmentedControlWrapper: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  segmentedControlContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 9,
    height: 50,
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
    letterSpacing: 0.3,
  },
  searchBtn: {
    marginLeft: 'auto',
  },
  activeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ReadexPro-Regular',
    fontWeight: '100',
  },
  inactiveText: {
    fontSize: 14,
    color: '#748DA6',
    fontFamily: 'ReadexPro-Regular',
  },
  arbitrary: { height: 42 },
  viewAll: {
    fontFamily: 'ReadexPro-Regular',
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
    marginBottom: 10,
  },

  container: {
    paddingVertical: 120,
    paddingBottom: 70 + 28,
    paddingLeft: Dimensions.get('window').width * 0.028,
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
  buttonWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    width: Dimensions.get('window').width,
    left: 0,
    bottom: 0,
    right: 0,
  },
  btnlarge: { height: 65 },
});

export default Products;
