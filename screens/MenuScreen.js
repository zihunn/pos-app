import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const MenuScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [menuItems, setMenuItems] = useState([]);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://192.168.20.149:8080/api/menus');
        const data = await response.json();
        setMenuItems(data); 
      } catch (error) {
        console.error('Error fetching menu items:', error);
        Alert.alert('Error', 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []); 

  return (
    <ScrollView style={styles.container}>
      {/* Loading Spinner */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F8BE40" />
          <Text>Loading Menu Items...</Text>
        </View>
      ) : (
        <>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a menu item"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Menu Item Cards */}
          <View style={styles.cardsContainer}>
            {menuItems
              .filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase()) // Filter berdasarkan nama menu
              )
              .map((item) => (
                <View key={item.id} style={styles.card}>
                  <Image
                    source={{ uri: `http://192.168.20.149:8080/storage/${item.image}` }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardStock}>Stock: {item.stock}</Text>
                    <Text style={styles.cardCategory}>Category: {item.category.name}</Text>
                    <TouchableOpacity style={styles.detailButton}>
                      <Text style={styles.detailButtonText}>See Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F9',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
  },
  cardsContainer: {
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardDetails: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardStock: {
    fontSize: 14,
    color: '#666',
  },
  cardCategory: {
    fontSize: 14,
    color: '#666',
  },
  detailButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#F8BE40',
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MenuScreen;
