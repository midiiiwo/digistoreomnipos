import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text } from 'react-native';
import { useGetGlobalProducts } from '../hooks/useGetGlobalProducts';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import { Checkbox } from 'react-native-ui-lib';
import PrimaryButton from './PrimaryButton';
import { useNavigation } from '@react-navigation/native';

const ProductListCoupon = ({ route }) => {
    const { user } = useSelector(state => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { data: allProducts, isLoading } = useGetGlobalProducts(user.merchant, 'ALL');
    const navigation = useNavigation();
    const { discount_id } = route.params || {};


    console.log(discount_id, "jumanji")

    useEffect(() => {
        if (allProducts && allProducts.data && allProducts.data.data) {
            // Populate selectedProducts from route.params if it exists
            if (route.params?.product_list) {
                setSelectedProducts(JSON.parse(route.params?.product_list));
            }

            setFilteredProducts(allProducts.data.data);
        }
    }, [allProducts, route.params]);

    useEffect(() => {
        if (allProducts && allProducts.data && allProducts.data.data) {
            const filtered = allProducts.data.data.filter(product =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, allProducts]);

    const handleProductSelect = (productId) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };
    const handleSelectProducts = () => {
        // Pass selected product IDs back to the Add Discount screen
        navigation.navigate('Create Coupon', {
            product_list: JSON.stringify(selectedProducts),
            discount_id: discount_id, // Pass the discount ID for editing
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Checkbox
                color={selectedProducts.includes(item.product_id) ? '#3967E8' : '#000'}
                value={selectedProducts.includes(item.product_id)}
                onValueChange={() => handleProductSelect(item.product_id)}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text style={styles.productDetails}>
                    {item.product_description || 'No description available'}
                </Text>
                <Text style={styles.productPrice}>
                    Price: {item.product_price} {item.currency}
                </Text>
            </View>
        </View>
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.product_id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <PrimaryButton
                style={styles.selectButton}
                handlePress={handleSelectProducts}>
                <Text style={styles.selectButtonText}>Select Products</Text>
            </PrimaryButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#DCDCDE',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 100,
    },
    selectButton: {
        backgroundColor: '#3967E8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    selectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DCDCDE',
    },
    productInfo: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productDetails: {
        fontSize: 14,
        color: '#666',
    },
    productPrice: {
        fontSize: 14,
        color: '#000',
        marginTop: 5,
    },
});

export default ProductListCoupon;