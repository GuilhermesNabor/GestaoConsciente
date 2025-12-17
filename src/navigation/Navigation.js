
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import MainScreen from '../screens/MainScreen';
import AddBalanceScreen from '../screens/AddBalanceScreen';
import GoalsScreen from '../screens/GoalsScreen';

const Tab = createBottomTabNavigator();

const Navigation = ({ name, salary }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Início">
          {(props) => <MainScreen {...props} name={name} salary={salary} />}
        </Tab.Screen>
        <Tab.Screen name="Adicionar Saldo" component={AddBalanceScreen} />
        <Tab.Screen name="Metas" component={GoalsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
