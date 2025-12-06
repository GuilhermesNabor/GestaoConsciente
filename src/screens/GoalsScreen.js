
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoalsScreen = ({ navigation }) => {
  const [goal, setGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState('');

  useEffect(() => {
    const getGoal = async () => {
      try {
        const savedGoal = await AsyncStorage.getItem('goal');
        if (savedGoal) {
          setCurrentGoal(savedGoal);
        }
      } catch (error) {
        console.error('Error getting goal:', error);
      }
    };
    getGoal();
  }, []);

  const handleSetGoal = async () => {
    if (goal) {
      try {
        await AsyncStorage.setItem('goal', goal);
        setCurrentGoal(goal);
        Alert.alert('Sucesso', 'Meta definida com sucesso!');
        setGoal('');
        navigation.goBack();
      } catch (error) {
        console.error('Error saving goal:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a meta.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha o campo da meta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Definir Meta de Poupança</Text>
      <Text style={styles.currentGoal}>Meta Atual: R$ {currentGoal}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nova Meta"
        placeholderTextColor="#2E8B57"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSetGoal}>
        <Text style={styles.buttonText}>Definir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  currentGoal: {
    fontSize: 18,
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#2E8B57',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoalsScreen;
