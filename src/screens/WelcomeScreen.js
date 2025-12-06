
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Gestão Consciente!</Text>
      <Text style={styles.subtitle}>Para começar, precisamos de algumas informações:</Text>
      <TextInput
        style={styles.input}
        placeholder="Qual o seu nome?"
        placeholderTextColor="#2E8B57"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Qual o seu salário?"
        placeholderTextColor="#2E8B57"
        value={salary}
        onChangeText={setSalary}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.button, (!name || !salary) && styles.disabledButton]}
        onPress={() => onComplete(name, salary)}
        disabled={!name || !salary}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0FFF0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#2E8B57',
    marginBottom: 30,
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
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
