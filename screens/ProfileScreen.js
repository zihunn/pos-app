import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation(); 

  const handleLogout = () => {
    navigation.replace('Login'); 
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image 
            source={require('../assets/beef-korean.jpeg')} r
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Jhon Guskin</Text>
          <Text style={styles.userEmail}>Guskinjhons@gmail.com</Text>
        </View>

        {/* Task Stats */}
        <View style={styles.taskStatsContainer}>
          <View style={styles.taskStatItem}>
            <Text style={styles.taskStatValue}>86</Text>
            <Text style={styles.taskStatLabel}>Total Tasks</Text>
          </View>
          <View style={styles.taskStatItem}>
            <Text style={styles.taskStatValue}>42</Text>
            <Text style={styles.taskStatLabel}>Complete</Text>
          </View>
          <View style={styles.taskStatItem}>
            <Text style={styles.taskStatValue}>44</Text>
            <Text style={styles.taskStatLabel}>Ongoing</Text>
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Profile Settings with Icons */}
        <View>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.leftSection}>
              <View style={styles.iconBackground}>
                <Ionicons name="person-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.settingsText}>Profile</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}
            onPress={() => navigation.navigate('Menu')}
          >
            <View style={styles.leftSection}>
              <View style={[styles.iconBackground, { backgroundColor: '#ff9800' }]}>
                <Ionicons name="restaurant-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.settingsText}>Menu</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* Category navigation */}
          <TouchableOpacity 
            style={styles.settingsItem} 
            onPress={() => navigation.navigate('Category')}
          >
            <View style={styles.leftSection}>
              <View style={[styles.iconBackground, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="pricetag-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.settingsText}>Category</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
            <View style={styles.leftSection}>
              <View style={[styles.iconBackground, { backgroundColor: '#f44336' }]}>
                <Ionicons name="power-outline" size={24} color="#fff" />
              </View>
              <Text style={[styles.settingsText, { color: '#f44336' }]}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F7F9F9',
  },
  container: {
    backgroundColor: '#F7F9F9',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  taskStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  taskStatItem: {
    alignItems: 'center',
  },
  taskStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8BE40',
  },
  taskStatLabel: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  iconBackground: {
    backgroundColor: '#F8BE40',
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  settingsText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
