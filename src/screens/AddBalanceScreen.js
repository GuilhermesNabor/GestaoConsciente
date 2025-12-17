
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBalanceScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  const handleAddBalance = async () => {
    if (amount) {
      try {
        const currentSalary = await AsyncStorage.getItem('salary');
        const newAmount = parseFloat(amount);
        const updatedSalary = (currentSalary ? parseFloat(currentSalary) : 0) + newAmount;

        await AsyncStorage.setItem('salary', updatedSalary.toString());
        Alert.alert('Sucesso', 'Saldo adicionado com sucesso!');
        setAmount('');
        navigation.goBack();
      } catch (error) {
        console.error('Error saving balance:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o saldo.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Saldo</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor"
        placeholderTextColor="#2E8B57"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddBalance}>
        <Text style={styles.buttonText}>Adicionar</Text>
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

export default AddBalanceScreen;
