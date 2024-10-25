/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  // Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  FlatList,
  Text,
} from 'react-native';
import * as Tabs from 'react-native-collapsible-tab-view';
import Lottie from 'lottie-react-native';
import AddCircle from '../../assets/icons/add-circle-dark.svg';
import Search from '../../assets/icons/search.svg';
import ArrowLeftShort from '../../assets/icons/arrow-left-short.svg';

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
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';
import { SheetManager } from 'react-native-actions-sheet';
import { useActionCreator } from '../hooks/useActionCreator';
// import Cart from './Cart';

const Viewer = ({ category, searchTerm, navigation, inventoryOutlet }) => {
  const { user } = useSelector(state => state.auth);
  const {
    data: allProducts,
    isLoading: isAllProductsLoading,
    refetch: refetchAll,
    isFetching: isRefetchingAll,
  } = useGetGlobalProducts(
    user.merchant,
    (inventoryOutlet && inventoryOutlet.outlet_id) || 'ALL',
  );

  const keyExtractor = item => item.product_id;

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
        />
      );
    },
    [navigation],
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
      />
    );
  }, []);

  if (isAllProductsLoading) {
    return <Loading />;
  }

  if (category.name !== 'All') {
    if (isAllProductsLoading) {
      return <Loading />;
    }
    return (
      <>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingAll}
              onRefresh={() => {
                refetchAll();
              }}
            />
          }
          keyExtractor={keyExtractor}
          style={styles.grid}
          contentContainerStyle={styles.container}
          data={[
            ...handleSearch(
              searchTerm,
              ((allProducts && allProducts.data && allProducts.data.data) || [])
                .filter(i => i != null)
                .filter(i => {
                  if (!i) {
                    return;
                  }
                  return i.product_category === category.name;
                }),
            ),
            { type: 'Add' },
          ]}
          numColumns={6}
          renderItem={renderCategoryItems}
        />
      </>
    );
  }
  if (
    ((allProducts && allProducts.data && allProducts.data.data) || []).filter(
      i => i != null,
    ).length === 0
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
            fontFamily: 'ReadexPro-bold',
            fontSize: 18,
            color: '#30475e',
          }}>
          You have no products yet
        </Text>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
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
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingAll}
            onRefresh={() => {
              refetchAll();
            }}
          />
        }
        keyExtractor={keyExtractor}
        style={styles.grid}
        contentContainerStyle={styles.container}
        data={[
          ...handleSearch(
            searchTerm,
            (
              (allProducts && allProducts.data && allProducts.data.data) ||
              []
            ).filter(i => i != null),
          ),
          { type: 'Add' },
        ]}
        numColumns={6}
        renderItem={renderAllItems}
      />
    </>
  );
};

const ProductsView = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const { inventoryOutlet } = useSelector(state => state.products);
  const { data, isLoading } = useGetAllProductsCategories(user.merchant);
  const [searchTerm, setSearchTerm] = React.useState('');
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
          />
        </Tabs.Lazy>
      </Tabs.Tab>
    );
  });
  return (
    <Tabs.Container
      lazy
      renderHeader={() => (
        <View style={styles.topIcons}>
          <Pressable style={styles.searchBox}>
            <Search
              stroke="#131517"
              height={24}
              width={24}
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
            style={{ marginLeft: 14 }}
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
            <AddCircle height={48} width={48} />
          </Pressable>
          <View style={{ marginRight: 14 }} />
          <ShadowedView
            style={shadowStyle({
              opacity: 0.1,
              radius: 1.5,
              offset: [0, 0],
            })}>
            <Pressable
              onPress={() => {
                SheetManager.show('inventoryOutlet', {
                  payload: { setInventoryOutlet, inventoryOutlet },
                });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 30,
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#304753',
                  fontSize: 16,
                }}>
                {inventoryOutlet && inventoryOutlet.outlet_name}
              </Text>
              <ArrowLeftShort
                style={{ marginLeft: 2 }}
                height={18}
                width={18}
              />
            </Pressable>
          </ShadowedView>
        </View>
      )}
      renderTabBar={props => (
        <Tabs.MaterialTabBar
          labelStyle={styles.labelStyle}
          {...props}
          style={styles.containerStyle}
          indicatorStyle={styles.indicatorStyle}
          tabStyle={styles.tabStyle}
          inactiveColor="#000"
          activeColor="#1942D8"
          scrollEnabled
        />
      )}>
      {screens}
    </Tabs.Container>
  );
};

const Products = ({ navigation }) => {
  const { activeProductsTab } = useSelector(state => state.products);

  const ref = React.useRef();

  React.useEffect(() => {
    if (ref) {
      ref.current.setPageWithoutAnimation(activeProductsTab);
    }
  }, [activeProductsTab]);

  return (
    <PagerView style={styles.main} ref={ref} initialPage={0}>
      <View key="0" collapsable={false}>
        <ProductsView navigation={navigation} />
      </View>
      <View key="1" collapsable={false}>
        <Categories navigation={navigation} />
      </View>
    </PagerView>
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
    height: 60,
  },
  tabView: {
    flex: 1,
    marginTop: 4,
  },
  containerStyle: { marginHorizontal: 12, marginTop: 12 },
  labelStyle: {
    fontFamily: 'ReadexPro-Medium',
    textTransform: 'uppercase',
    fontSize: 14,
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
    fontFamily: 'ReadexPro-Regular',
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
    height: 55,
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
    marginTop: 4,
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
    width: '100%',
    // alignItems: 'center',
    paddingLeft: Dimensions.get('window').width * 0.018,
    paddingTop: 20,
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
