import React, { useState,useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [menuData, setMenuData] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch('http://192.168.20.149:8080/api/categories');
          const data = await response.json();
          setCategories(data);
          setLoadingCategories(false);
          
          if (data.length > 0) {
            setActiveCategory(data[0].name); 
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setLoadingCategories(false);
        }
      };

      fetchCategories();
    }, [])
  );

  useEffect(() => {
    if (activeCategory) {
      const fetchMenu = async () => {
        setLoadingMenu(true);
        try {
          const category = categories.find(cat => cat.name === activeCategory);
          const response = await fetch(`http://192.168.20.149:8080/api/menus/category/${category.id}`);
          const data = await response.json();
          setMenuData(prevData => ({
            ...prevData,
            [category.name]: data,
          }));
          setLoadingMenu(false);
        } catch (error) {
          console.error('Error fetching menu:', error);
          setLoadingMenu(false);
        }
      };

      fetchMenu();
    }
  }, [activeCategory, categories]);


  const addToCart = async (item) => {
    try {
     const response = await fetch('http://192.168.20.149:8080/api/carts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: item.name,
        category: item.category.name,
        img: item.image,
        qty: 1,
        price: item.price,
      }),
    });


      if (response.ok) {
        const cartItem = await response.json();
        alert('Item added to cart!');
      } else {
        alert('Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  };

  if (loadingCategories) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Categories...</Text>
      </SafeAreaView>
    );
  }

  if (loadingMenu) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Menu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#5f6368" />
          <TextInput
            style={styles.input}
            placeholder="Search ..."
            placeholderTextColor="#5f6368"
          />
          <Ionicons name="filter" size={20} color="#5f6368" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.name && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category.name)} // Use category.name
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.name && styles.activeCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuData[activeCategory] && menuData[activeCategory].length > 0 ? (
            menuData[activeCategory].map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: `http://192.168.20.149:8080/storage/${item.image}` }} style={styles.cardImage} />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardPrice}>
                    Rp {parseInt(item.price).toLocaleString()} 
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item)} // Add to cart on click
                >
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', marginTop: 100 }}>No menu available in this category.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F7F9F9',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F7F9F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 20,
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    height: 35,
  },
  activeCategoryButton: {
    backgroundColor: '#bfeff5',
    borderColor: '#F8BE40',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  activeCategoryText: {
    color: '#333',
    fontWeight: 'bold',
  },
  menuContainer: {
    marginTop: 20,
    paddingBottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImageContainer: {
    alignItems: 'center',
    padding:15,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  cardDetails: {
    marginTop: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  cardRating: {
    fontSize: 14,
    color: '#777',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8BE40',
  },
  cardOldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discount: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#F8BE40',
    borderRadius: 10,
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;
