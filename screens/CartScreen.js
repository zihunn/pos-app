import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, FlatList,ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartData = async () => {
    try {
      const response = await fetch('http://192.168.20.149:8080/api/carts');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartData();
    }, [])
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const incrementQty = (itemId) => {
    setItems(items.map(item => item.id === itemId ? { ...item, qty: item.qty + 1 } : item));
  };

  const decrementQty = (itemId) => {
    setItems(items.map(item => item.id === itemId && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://192.168.20.149:8080/api/carts/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
      } else {
        console.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const renderRightActions = (itemId) => (
    <TouchableOpacity onPress={() => removeItem(itemId)} style={styles.removeButton}>
      <Ionicons name="trash-outline" size={24} color="red" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading Categories...</Text>
            </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.topSection}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(item.id)}
            >
              <View style={styles.cartItem}>
                <Image source={{ uri: `http://192.168.20.149:8080/storage/${item.img}` }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemPrice}>Rp. {formatPrice(item.price)}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decrementQty(item.id)}>
                    <Ionicons name="remove-circle-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => incrementQty(item.id)}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          )}
        />
      </GestureHandlerRootView>
      <View style={styles.bottomSection}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryText}>Subtotal:</Text>
          <Text style={styles.summaryValue}>Rp. {formatPrice(items.reduce((total, item) => total + parseFloat(item.price) * item.qty, 0))}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryText}>Tax (10%):</Text>
          <Text style={styles.summaryValue}>Rp. {formatPrice((items.reduce((total, item) => total + parseFloat(item.price) * item.qty, 0) * 0.1).toFixed(0))}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryText}>Fee:</Text>
          <Text style={styles.summaryValue}>Rp. 5.000</Text> 
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryText}>Total:</Text>
          <Text style={styles.summaryValue}>
            Rp. {formatPrice((items.reduce((total, item) => total + parseFloat(item.price) * item.qty, 0) * 1.1 + 5000).toFixed(0))}
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F9',
  },
  topSection: {
    flex: 2,
    padding: 10,
  },
  bottomSection: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // iOS shadow color
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.1, // iOS shadow opacity
    shadowRadius: 10, // iOS shadow radius
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  itemDetails: {
    marginLeft: 15,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCategory: {
    fontSize: 14,
    color: '#888',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background
    justifyContent: 'center',
    alignItems: 'center',
    height: '85%',
    width: 80,
    borderRadius: 8,
    padding: 10,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CartScreen;
