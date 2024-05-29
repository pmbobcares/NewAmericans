import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../components/Cart/CartProvider';
import SubmitModal from '../Modals/SubmitModal';

const CartScreen = () => {
    const { cartItems, clearCart, removeFromCart } = useCart();
    const [modalVisible, setModalVisible] = useState(false);
    const [cartItemsWithQuantity, setCartItemsWithQuantity] = useState([]);

    // Update cartItemsWithQuantity whenever cartItems changes
    useEffect(() => {
        // Map over cartItems to include Quantity property
        const updatedCartItemsWithQuantity = cartItems.map(item => ({
            ...item,
            Quantity: 1 // Default quantity
        }));
        setCartItemsWithQuantity(updatedCartItemsWithQuantity);
    }, [cartItems]);

    const handleClearCart = () => {
        clearCart(); 
    };

    const handleSubmitOrder = () => {
        setModalVisible(true);
    };

    const handleInputChange = (text, itemId) => {
        const updatedCartItemsWithQuantity = cartItemsWithQuantity.map(item => {
            if (item.ProductID === itemId) {
                // Convert text to a number and ensure it's between 1 and 10
                const quantity = Math.min(Math.max(parseInt(text) || 0, 1), 10);
                return {
                    ...item,
                    Quantity: quantity
                };
            }
            return item;
        });
        setCartItemsWithQuantity(updatedCartItemsWithQuantity);
    };

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId); 
    };

    const cartItemComponents = cartItemsWithQuantity.map(item => (
        <View key={item.ProductID} style={[styles.itemContainer, { borderColor: '#F3D014', borderWidth: 2 }]}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.ProductName}</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    placeholder="Quantity"
                    onChangeText={(text) => handleInputChange(text, item.ProductID)}
                />
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.ProductID)}>
                <Ionicons name="trash-bin-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    ));

    return (
        <View style={styles.container}>
            <Text style={styles.title}></Text>
            <ScrollView>
                {cartItemComponents}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleClearCart}>
                    <Text style={styles.buttonText}>Clear Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSubmitOrder}>
                    <Text style={styles.buttonText}>Submit Order</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.reservedSpace}></View>
            <SubmitModal visible={modalVisible} onClose={() => setModalVisible(false)} cartItemsWithQuantity={cartItemsWithQuantity} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 8,
        padding: 10,
    },
    itemInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#F3D014',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#F3D014',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    reservedSpace: {
        height: 80,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginLeft: 10, // Add some margin between the name and the input
    },
});

export default CartScreen;
