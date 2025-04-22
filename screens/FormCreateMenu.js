import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 

const FormCreateMenuScreen = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); 
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('active');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [isModalVisible, setModalVisible] = useState(false); 

  useEffect(() => {
    fetch('http://192.168.20.149:8080/api/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCategorySelect = (categoryId, categoryName) => {
    setCategory(categoryName);
    setCategoryId(categoryId);
    setModalVisible(false);
  };

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photo library to pick an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images, 
      quality: 1, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); 
    }
  };

  // Fungsi untuk validasi form
  const validateForm = () => {
    if (!name || !description || !image || !category || !stock || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return false;
    }
    return true;
  };

  // Fungsi untuk mengirim data menu ke API
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const menuData = new FormData();
    menuData.append('name', name);
    menuData.append('description', description);
    menuData.append('status', status);
    menuData.append('stock', stock);
    menuData.append('price', price);
    menuData.append('category_id', categoryId);

    const imageFile = {
      uri: image,
      name: image.split('/').pop(), 
      type: 'image/jpeg',
    };
    menuData.append('image', imageFile);

    try {
      const response = await fetch('http://192.168.20.149:8080/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: menuData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Menu created successfully');
        setName('');
        setDescription('');
        setImage(null);
        setCategory('');
        setStock('');
        setPrice('');
      } else {
        Alert.alert('Error', 'Failed to create menu');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item.id, item.name)}
    >
      <Text style={styles.categoryItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.selectedImage} />}

      <TouchableOpacity style={styles.uploadButton} onPress={handleImageSelect}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Menu Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Description :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Select Category :</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{category ? category : "Select Category"}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Category</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Stock :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Stock Quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Price :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Price (in Rp)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Select Status</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, status === 'Active' && styles.selectedStatus]}
          onPress={() => setStatus('Active')}
        >
          <Text style={styles.statusButtonText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, status === 'Inactive' && styles.selectedStatus]}
          onPress={() => setStatus('Inactive')}
        >
          <Text style={styles.statusButtonText}>Inactive</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.uploadButton, { backgroundColor: '#4CAF50', marginTop: 20, marginBottom: 50 }]} onPress={handleSubmit}>
        <Text style={styles.uploadButtonText}>Create Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 16,
    fontSize: 16,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#F8BE40',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryItemText: {
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statusButton: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  selectedStatus: {
    backgroundColor: '#F8BE40',
  },
  statusButtonText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#F8BE40',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FormCreateMenuScreen;
