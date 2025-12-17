
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import MainScreen from '../screens/MainScreen';
import AddBalanceScreen from '../screens/AddBalanceScreen';
import GoalsScreen from '../screens/GoalsScreen';

const Tab = createBottomTabNavigator();

const Navigation = ({ name, salary }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = 'home';
            } else if (route.name === 'Adicionar Saldo') {
              iconName = 'plus-circle';
            } else if (route.name === 'Metas') {
              iconName = 'target';
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Início" options={{ headerShown: false }}>
          {(props) => <MainScreen {...props} name={name} salary={salary} />}
        </Tab.Screen>
        <Tab.Screen name="Adicionar Saldo" component={AddBalanceScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Metas" component={GoalsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
