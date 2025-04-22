import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import BottomTabNavigator from './navigation/BottomTabNavigator'; 
import CategoryScreen from './screens/CategoryScreen'; 
import MenuScreen from './screens/MenuScreen'; 
import FormCreateMenuScreen from './screens/FormCreateMenu'; 
import LoginScreen from './screens/LoginScreen';  // Import LoginScreen
import { Ionicons } from 'react-native-vector-icons';

const Stack = createStackNavigator(); 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userIsLoggedIn = false;
      setIsLoggedIn(userIsLoggedIn);
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Home" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen} 
          options={({ navigation }) => ({
            title: 'Category', 
            headerLeft: () => (
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#333" 
                style={{ marginLeft: 15 }} 
                onPress={() => navigation.goBack()} 
              />
            ),
          })} 
        />
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={({ navigation }) => ({
            title: 'Menu', 
            headerLeft: () => (
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#333" 
                style={{ marginLeft: 15 }} 
                onPress={() => navigation.goBack()} 
              />
            ),
            headerRight: () => (
              <Ionicons 
                name="add" 
                size={24} 
                color="#333" 
                style={{ marginRight: 15 }} 
                onPress={() => navigation.navigate('CreateMenu')} 
              />
            ),
          })} 
        />
        <Stack.Screen 
          name="CreateMenu" 
          component={FormCreateMenuScreen} 
          options={({ navigation }) => ({
            title: 'Create Menu', 
            headerLeft: () => (
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#333" 
                style={{ marginLeft: 15 }} 
                onPress={() => navigation.goBack()} 
              />
            ),
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
