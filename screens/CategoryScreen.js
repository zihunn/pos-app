import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from 'react-native-vector-icons';

const CategoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryStatus, setCategoryStatus] = useState('Active');
  const [categories, setCategories] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState(null); 
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); 
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetch('http://192.168.20.149:8080/api/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false); // Data loaded, hide the loading spinner
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Hide the spinner even on error
      });
  }, []);

  const handleSave = () => {
    if (!categoryName || !categoryStatus) {
      Alert.alert('Error', 'Please fill in all fields');
      return; 
    }

    fetch('http://192.168.20.149:8080/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryName,
        status: categoryStatus,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          Alert.alert('Success', 'Category created successfully!');
          setCategories((prevCategories) => [...prevCategories, data]); 
          setModalVisible(false); 
          setCategoryName(''); 
          setCategoryStatus('Active'); 
        } else {
          Alert.alert('Error', 'Failed to create category. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error creating category:', error);
        Alert.alert('Error', 'An error occurred while creating the category.');
      });
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;

    fetch(`http://192.168.20.149:8080/api/categories/${categoryToDelete.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          Alert.alert('Success', 'Category deleted successfully!');
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryToDelete.id)
          );
          setDeleteModalVisible(false); 
        } else {
          Alert.alert('Error', 'Failed to delete category. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        Alert.alert('Error', 'An error occurred while deleting the category.');
      });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F8BE40" />
        <Text>Loading Categories...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Create Category</Text>
      </TouchableOpacity>

      {/* Modal for Create Category */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create a New Category</Text>

            {/* Category Name Input */}
            <Text style={styles.dropdownLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Category Name"
              value={categoryName}
              onChangeText={(text) => setCategoryName(text)}
            />

            {/* Status Buttons */}
            <Text style={styles.dropdownLabel}>Select Status</Text>
            <View style={styles.statusButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  categoryStatus === 'Active' && styles.activeButton,
                ]}
                onPress={() => setCategoryStatus('Active')}
              >
                <Text
                  style={
                    categoryStatus === 'Active'
                      ? styles.selectedButtonText
                      : styles.unselectedButtonText
                  }
                >
                  Active
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  categoryStatus === 'Inactive' && styles.inactiveButton,
                ]}
                onPress={() => setCategoryStatus('Inactive')}
              >
                <Text
                  style={
                    categoryStatus === 'Inactive'
                      ? styles.selectedButtonText
                      : styles.unselectedButtonText
                  }
                >
                  Inactive
                </Text>
              </TouchableOpacity>
            </View>

            {/* Save and Close Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Category</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete the category "{categoryToDelete?.name}"?
            </Text>

            <View style={[styles.buttonRow, { marginTop: 20 }]}>
              <TouchableOpacity style={styles.saveButton} onPress={handleDelete}>
                <Text style={styles.saveButtonText}>Yes, Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category List */}
      {categories.length > 0 ? (
        categories.map((category) => (
          <View key={category.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardName}>{category.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  category.status === 'Active' ? styles.activeStatus : styles.inactiveStatus,
                ]}
              >
                <Text style={styles.statusText}>{category.status}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="create-outline" size={24} color="#F8BE40" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setCategoryToDelete(category); 
                  setDeleteModalVisible(true); 
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No categories found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9F9',
  },
  container: {
    padding: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F8BE40',
    backgroundColor: '#bfeff5',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
  },
  activeButton: {
    backgroundColor: '#F8BE40',
  },
  inactiveButton: {
    backgroundColor: '#f44336',
  },
  selectedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  unselectedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  saveButton: {
    width: '48%',
    paddingVertical: 12,
    backgroundColor: '#00d443',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: '48%',
    paddingVertical: 12,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: 70,
    alignItems: 'center',
  },
  activeStatus: {
    backgroundColor: '#F8BE40',
  },
  inactiveStatus: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default CategoryScreen;
