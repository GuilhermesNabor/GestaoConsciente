
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './src/screens/WelcomeScreen';
import Navigation from './src/navigation/Navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
};

const AppContent = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const salary = await AsyncStorage.getItem('salary');

        if (name !== null && salary !== null) {
          setName(name);
          setSalary(salary);
          setIsFirstLaunch(false);
        } else {
          setIsFirstLaunch(true);
        }
      } catch (error) {
        console.error('Error reading data from AsyncStorage:', error);
        setIsFirstLaunch(true);
      }
    };

    checkFirstLaunch();
  }, []);

  const handleWelcomeComplete = async (name, salary) => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('salary', salary);
      setName(name);
      setSalary(salary);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F0FFF0' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FFF0" />
      {isFirstLaunch ? (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      ) : (
        <Navigation name={name} salary={salary} />
      )}
    </View>
  );
};

export default App;
